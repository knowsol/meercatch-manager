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

  s = s.replace(/<CardTitle([^>]*)>([^<]+)<\/motion.div>/g, '<CardTitle$1>$2</CardTitle>');
  s = s.replace(/<CardTitle([^>]*)>([^<]+)<\/div>/g, '<CardTitle$1>$2</CardTitle>');

  s = s.replace(/<div className="card /g, '<Card className="');
  s = s.replace(/<div className="card">/g, '<Card>');

  // button with Button close - second pass
  s = s.replace(
    /<button\s+className="btn btn-outline btn-sm"\s+onClick=\{([^}]+)\}\s*>\s*([^<]+)\s*<\/Button>/g,
    '<Button variant="outline" size="sm" onClick={$1}>$2</Button>',
  );

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('fixed:', path.relative(viewsDir, file));
  }
}
