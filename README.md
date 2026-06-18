# D-QueenCart Jewellery & Accessories — Complete Setup Guide

## 📁 Project Structure
```
jewellery-site/
├── index.html          ← Home Page (Hero, Categories, Products, Testimonials)
├── auth.html           ← Login & Register (OTP-based with Firebase)
├── products.html       ← Product Showcase (Grid, Filters, Sort)
├── cart.html           ← Shopping Cart (Quantity, Coupon, Summary)
├── checkout.html       ← Checkout + WhatsApp Order Integration
├── admin.html          ← Admin Dashboard (Products CRUD, Orders, Analytics)
├── firebase-config.js  ← Firebase Configuration (edit this!)
├── cart.js             ← Shared Cart Utility
└── README.md           ← This file
```

---

## 🚀 Step 1 — Firebase Setup (Free)

### 1.1 Create Project
1. Go to https://console.firebase.google.com
2. Click **"Add Project"** → name it `D-QueenCart-jewellery`
3. Disable Google Analytics (optional) → Create

### 1.2 Enable Firestore Database
1. Left sidebar → **Firestore Database** → Create database
2. Choose **"Start in test mode"** (allows free read/write for 30 days)
3. Select region: `asia-south1` (Mumbai) for India

### 1.3 Enable Authentication (Phone OTP)
1. Left sidebar → **Authentication** → Get started
2. **Sign-in method** tab → Enable **Phone**
3. For testing: Add test phone number `+91 9876543210` with code `123456`

### 1.4 Enable Storage (for product images)
1. Left sidebar → **Storage** → Get started
2. Start in test mode → Choose region

### 1.5 Get Your Config
1. Project Settings (⚙️ icon) → **General** → **Your apps**
2. Click **Web app** (`</>` icon) → Register app → Copy config

### 1.6 Update firebase-config.js
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "D-QueenCart-jewellery.firebaseapp.com",
  projectId: "D-QueenCart-jewellery",
  storageBucket: "D-QueenCart-jewellery.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

### 1.7 Add Firebase SDK to all HTML files
Add these before your closing `</body>` tag in each HTML file:
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
<script src="firebase-config.js"></script>
```

---

## 📱 Step 2 — WhatsApp Order Integration

In `checkout.html`, find this line and update your number:
```javascript
const OWNER_WHATSAPP = '919876543210'; // Format: country code + number (no + or spaces)
// Example for India: 91XXXXXXXXXX
```

---

## 🖼️ Step 3 — Image Background Removal (Optional)

### Using remove.bg (50 free credits/month)
1. Sign up at https://www.remove.bg/
2. Go to Account → API Keys → Copy your key
3. In `admin.html`, find:
```javascript
const REMOVE_BG_KEY = 'YOUR_REMOVE_BG_API_KEY';
```
4. Replace with your actual key

### Free Alternative: rembg Python library
```bash
pip install rembg
rembg i input.jpg output.png
```

---

## 🌐 Step 4 — Deployment (100% Free)

### Option A: Netlify (Recommended — easiest)
1. Go to https://netlify.com → Sign up free
2. Drag and drop your entire `jewellery-site/` folder onto the Netlify dashboard
3. Done! You get a live URL instantly (e.g., `D-QueenCart-jewellery.netlify.app`)
4. Custom domain: Go to Domain Settings → Add your domain

### Option B: Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/D-QueenCart-jewellery.git
git push -u origin main
```
3. In Vercel: Import Project → Select your repo → Deploy
4. Done! Live at `D-QueenCart-jewellery.vercel.app`

### Option C: GitHub Pages
1. Create GitHub repo, push files
2. Settings → Pages → Source: main branch / root
3. Live at `yourusername.github.io/D-QueenCart-jewellery`

---

## 🔐 Step 5 — Admin Dashboard Access
- URL: `yoursite.com/admin.html`
- Default credentials:
  - Email: `admin@D-QueenCart.in`
  - Password: `Priya!@Dharshini#Perumal@30091987%&*`
- ⚠️ Change these in `admin.html` before deploying to production!

---

## 🧪 Sample Data for Testing

### Test OTP Login
- Phone: `+91 9876543210`
- OTP: `123456` (in demo mode, any 6 digits work)

### Test Coupon Codes
- `D-QueenCart10` → 10% off
- `WELCOME15` → 15% off
- `LUXURY20` → 20% off

---

## 📦 Firestore Database Structure

```
/products
  └── {productId}
        ├── name: "Celestial Gold Necklace"
        ├── category: "necklaces"
        ├── price: 2499
        ├── oldPrice: 3200
        ├── image: "https://..."
        ├── badge: "New"
        ├── material: "gold"
        ├── rating: 5
        ├── desc: "..."
        └── createdAt: timestamp

/orders
  └── {orderId}
        ├── customer: { name, phone, email, address }
        ├── items: [{ name, price, qty, image }]
        ├── subtotal: 2499
        ├── total: 2499
        ├── status: "pending"
        └── createdAt: timestamp

/users
  └── {userId}
        ├── name: "Priya Sharma"
        ├── phone: "+91 98765 43210"
        ├── email: "priya@email.com"
        └── createdAt: timestamp
```

---

## ✅ Features Checklist

| Feature | Status |
|---------|--------|
| Home Page with Parallax & Animations | ✅ |
| Custom Mouse Cursor | ✅ |
| Smooth Scroll Animations (AOS) | ✅ |
| Login / Register Page | ✅ |
| OTP Phone Auth (Firebase) | ✅ |
| Products Grid with Filters | ✅ |
| Grid / List View Toggle | ✅ |
| Add to Cart | ✅ |
| Wishlist | ✅ |
| Cart with Quantity Controls | ✅ |
| Coupon Codes | ✅ |
| Checkout Form | ✅ |
| WhatsApp Order Button | ✅ |
| Admin Dashboard | ✅ |
| Sales Charts (Chart.js) | ✅ |
| Product Upload (Admin) | ✅ |
| Background Removal API | ✅ |
| Firebase Firestore Integration | ✅ |
| Responsive Mobile Design | ✅ |
| Free Deployment Ready | ✅ |

---

## 💰 Cost Breakdown — All FREE!

| Service | Free Tier |
|---------|-----------|
| Firebase Firestore | 1 GB storage, 50K reads/day |
| Firebase Auth (Phone) | 10K verifications/month |
| Firebase Storage | 5 GB storage |
| Netlify Hosting | 100 GB bandwidth/month |
| remove.bg | 50 credits/month |
| Chart.js | Open source |
| AOS Animations | Open source |

---

## 🛠️ Tech Stack Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Animations**: AOS (Animate on Scroll), CSS Keyframes
- **Charts**: Chart.js
- **Backend/DB**: Firebase Firestore
- **Auth**: Firebase Phone Authentication (OTP)
- **Storage**: Firebase Cloud Storage
- **Image BG Removal**: remove.bg API
- **Checkout**: WhatsApp API Integration
- **Hosting**: Netlify / Vercel / GitHub Pages

---

## 📞 Support

For WhatsApp integration issues, make sure:
1. Phone number format: `91XXXXXXXXXX` (no + or spaces)
2. WhatsApp is installed on the device placing the order
3. URL format: `https://wa.me/91XXXXXXXXXX?text=YOUR_MESSAGE`
