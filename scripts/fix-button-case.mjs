import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const viewsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/views');

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

for (const file of walk(viewsDir)) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  s = s.replace(/<button variant/g, '<Button variant');
  s = s.replace(/(<Button[\s\S]*?)<\/button>/g, '$1</Button>');
  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('fixed:', path.relative(viewsDir, file));
  }
}
