"""
D-QueenCart Background Removal Server
======================================
Uses rembg with GPU acceleration (CUDA) for free, unlimited, fast bg removal.

SETUP (one time):
  pip install rembg[gpu] flask flask-cors Pillow

  If you don't have CUDA / prefer CPU-only:
  pip install rembg flask flask-cors Pillow

RUN:
  python bg_server.py

Then open admin.html — the "Remove Background" button will use this server.
The server runs on http://localhost:7788
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from rembg import remove, new_session
from PIL import Image
import io
import base64
import sys
import os

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8', errors='replace') if hasattr(sys.stdout, 'reconfigure') else None

app = Flask(__name__)
CORS(app)  # Allow requests from the browser (admin.html)

# Load model once at startup — much faster than loading per-request
# Using 'u2net' for broad compatibility. Switch to 'isnet-general-use' if quality needs improvement.
print("Loading background removal model... (one-time, takes ~10 seconds)")
try:
    session = new_session("u2net")
    print("[OK] u2net model loaded successfully!")
except Exception as e:
    print(f"[ERROR] Could not load model: {e}")
    session = None


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok", "message": "BG removal server is running!"})

@app.route('/remove-bg', methods=['POST'])
def remove_bg():
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode base64 image from browser
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',', 1)[1]
        
        img_bytes = base64.b64decode(image_data)
        input_img = Image.open(io.BytesIO(img_bytes))
        
        # Remove background using GPU-accelerated rembg with edge post-processing
        output_img = remove(input_img, session=session, post_process_mask=True)
        
        # 1. Tightly crop the object
        bbox = output_img.getbbox()
        if bbox:
            output_img = output_img.crop(bbox)
            
            # 2. Add professional e-commerce white background with padding
            # Calculate padding (15% of the largest dimension)
            padding = int(max(output_img.size) * 0.15)
            
            # Create a square canvas (standard for shop images)
            size = max(output_img.width, output_img.height) + (padding * 2)
            
            # Create a pristine solid white background
            background = Image.new('RGB', (size, size), (255, 255, 255))
            
            # Center the product on the white canvas
            x = (size - output_img.width) // 2
            y = (size - output_img.height) // 2
            
            # Paste using the foreground's alpha channel as the transparency mask
            background.paste(output_img, (x, y), output_img)
            output_img = background
        
        # Encode result as JPEG base64 (since it's a solid background now, JPEG is smaller/faster)
        buf = io.BytesIO()
        output_img.save(buf, format='JPEG', quality=95)
        buf.seek(0)
        result_b64 = base64.b64encode(buf.read()).decode('utf-8')
        
        return jsonify({
            "success": True,
            "image": "data:image/jpeg;base64," + result_b64
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = 7788
    print(f"\n{'='*50}")
    print(f"  D-QueenCart BG Removal Server")
    print(f"  Running on: http://localhost:{port}")
    print(f"  Keep this window open while using admin panel!")
    print(f"{'='*50}\n")
    app.run(host='127.0.0.1', port=port, debug=False)
