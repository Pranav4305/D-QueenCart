const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const p = path.join(dir, file);
  let cnt = fs.readFileSync(p, 'utf8');
  if (!cnt.includes('enhanced-theme.css')) {
    cnt = cnt.replace('</head>', '  <link rel="stylesheet" href="enhanced-theme.css" />\n</head>');
    fs.writeFileSync(p, cnt);
  }
});
console.log('Successfully injected theme to ' + files.length + ' files');
