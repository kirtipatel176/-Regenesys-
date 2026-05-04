const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const originalContent = content;
    
    // Remove the component
    content = content.replace(/<PrivateGPT \/>/g, '');
    
    // Remove the import
    content = content.replace(/import PrivateGPT from '\.\.\/components\/PrivateGPT';\r?\n/g, '');
    content = content.replace(/import PrivateGPT from '\.\.\/components\/PrivateGPT';/g, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Cleaned ${file}`);
    }
  }
});
