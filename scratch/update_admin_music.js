const fs = require('fs');

let c = fs.readFileSync('src/pages/admin/AdminMusic.jsx', 'utf8');

c = c.replace(/5MB/g, '3MB');

// Add file size check
const handleFileChangeRegex = /const handleFileChange = async \(e\) => \{\s*const file = e\.target\.files\?\.\[0\];\s*if \(\!file\) return;\s*setFileName\(file\.name\);/;
const handleFileChangeNew = `const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'File is too large! Please use a file smaller than 3MB or use the URL method.' } })
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFileName(file.name);`;

if (c.match(handleFileChangeRegex)) {
  c = c.replace(handleFileChangeRegex, handleFileChangeNew);
  fs.writeFileSync('src/pages/admin/AdminMusic.jsx', c);
  console.log('AdminMusic.jsx updated successfully.');
} else {
  // If line endings are different, just try simple replace
  const simpleReplace = `const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;`;
  
  const simpleReplaceWithCheck = `const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'File is too large! Please use a file smaller than 3MB or use the URL method.' } })
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }`;
    
  if (c.includes(simpleReplace)) {
    c = c.replace(simpleReplace, simpleReplaceWithCheck);
    fs.writeFileSync('src/pages/admin/AdminMusic.jsx', c);
    console.log('AdminMusic.jsx updated successfully (simple replace).');
  } else {
    console.log('Could not find handleFileChange to inject file size limit.');
  }
}
