import re, sys

filepath = sys.argv[1]
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def fix_url(match):
    url = match.group(0)
    photo_match = re.search(r'photo-[a-zA-Z0-9_-]+', url)
    if photo_match:
        photo_id = photo_match.group(0)
        w_match = re.search(r'w=(\d+)', url)
        w = w_match.group(1) if w_match else '600'
        return 'https://images.unsplash.com/' + photo_id + '?auto=format&fit=crop&w=' + w + '&q=80'
    return url

content = re.sub(r'https://images\.unsplash\.com/photo-[^\s"\']+', fix_url, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed URLs in ' + filepath)
