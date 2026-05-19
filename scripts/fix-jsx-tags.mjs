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

  // CardTitle wrongly closed with </div> immediately after title text
  s = s.replace(/(<CardTitle[^>]*>)\s*([\s\S]*?)\s*<\/div>/g, (m, open, inner) => {
    if (inner.includes('<') && !inner.trim().match(/^[^<]+$/)) return m;
    return `${open}${inner}</CardTitle>`;
  });

  // Fix button/Button mismatch: opening button with closing Button
  s = s.replace(
    /<button(\s+className="btn[^"]*"[^>]*)>([\s\S]*?)<\/Button>/g,
    '<Button$1>$2</Button>',
  );
  s = s.replace(
    /<button(\s+className="btn[^"]*"[^>]*)>([\s\S]*?)<\/Button>/g,
    (_, attrs, text) => {
      const sm = attrs.includes('btn-sm') ? ' size="sm"' : '';
      const xs = attrs.includes('btn-xs') ? ' size="xs"' : '';
      let variant = 'primary';
      if (attrs.includes('btn-outline')) variant = 'outline';
      else if (attrs.includes('btn-d')) variant = 'danger';
      else if (attrs.includes('btn-s')) variant = 'secondary';
      else if (attrs.includes('btn-warn')) variant = 'warn';
      else if (attrs.includes('btn-ok')) variant = 'ok';
      const onClick = attrs.match(/onClick=\{[^}]+\}/)?.[0] || '';
      const disabled = attrs.includes('disabled') ? ' disabled' : '';
      return `<Button variant="${variant}"${sm || xs}${disabled}${onClick ? ' ' + onClick : ''}>${text}</Button>`;
    },
  );

  // card div -> Card
  s = s.replace(/<div className="card /g, '<Card className="');
  s = s.replace(/<motion.div className="card /g, '<Card className="');
  s = s.replace(/<div className="card">/g, '<Card>');
  s = s.replace(/<div className="card section-gap">/g, '<Card className="section-gap">');
  s = s.replace(/<div className="card mt-20">/g, '<Card className="mt-20">');

  // Section in Components - fix closing
  s = s.replace(
    /(<CardTitle[^>]*>\s*\{title\}\s*)<\/motion.div>/g,
    '$1</CardTitle>',
  );
  s = s.replace(
    /(<CardTitle[^>]*>\s*\{title\}\s*)<\/div>\s*\{children\}\s*<\/motion.div>/g,
    '$1</CardTitle>\n      {children}\n    </Card>',
  );

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('fixed:', path.relative(viewsDir, file));
  }
}
