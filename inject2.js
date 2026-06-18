const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const p = path.join(dir, file);
  let cnt = fs.readFileSync(p, 'utf8');
  if (!cnt.includes('luxury-ui.js')) {
    cnt = cnt.replace('</head>', '  <script src="luxury-ui.js"></script>\n</head>');
    fs.writeFileSync(p, cnt);
  }
});
console.log('Injected luxury-ui.js script to ' + files.length + ' files');
