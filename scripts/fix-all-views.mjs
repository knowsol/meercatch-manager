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

  // button open + Button close -> button close
  s = s.replace(/<button\b([^>]*)>([\s\S]*?)<\/Button>/gi, '<button$1>$2</button>');

  // select open + Select close -> select close (keep native if not migrated)
  s = s.replace(/<select\b([^>]*)>([\s\S]*?)<\/Select>/gi, '<select$1>$2</select>');

  // FormGroup closed with div
  s = s.replace(/(<FormGroup[^>]*>[\s\S]*?)<\/div>(\s*\n\s*(?:<FormGroup|<\/FormGroup|<div className="section|<Button|<\/div>))/g, '$1</FormGroup>$2');

  // FilterBar closed with div
  s = s.replace(/(<FilterBar[^>]*>[\s\S]*?)<\/motion.div>(\s*\n\s*<(?:DataTable|Table))/g, '$1</FilterBar>$2');
  s = s.replace(/(<FilterBar[^>]*>[\s\S]*?)<\/div>(\s*\n\s*<(?:DataTable|Table))/g, '$1</FilterBar>$2');

  // btn class on Button -> variant
  s = s.replace(/<Button className="btn btn-p([^"]*)"([^>]*)>/g, '<Button variant="primary"$2>');
  s = s.replace(/<Button className="btn btn-outline([^"]*)"([^>]*)>/g, '<Button variant="outline"$2>');
  s = s.replace(/<Button className="btn btn-d([^"]*)"([^>]*)>/g, '<Button variant="danger"$2>');
  s = s.replace(/<Button className="btn btn-s([^"]*)"([^>]*)>/g, '<Button variant="secondary"$2>');
  s = s.replace(/<Button className="btn btn-primary([^"]*)"([^>]*)>/g, '<Button variant="primary"$2>');
  s = s.replace(/<Button className="btn btn-sm([^"]*)"([^>]*)>/g, '<Button size="sm"$1$2>');
  s = s.replace(/<Button className="btn btn-xs([^"]*)"([^>]*)>/g, '<Button size="xs"$1$2>');

  // Remaining btn buttons -> Button
  s = s.replace(
    /<button\s+className="btn btn-outline"([^>]*)>([\s\S]*?)<\/button>/g,
    '<Button variant="outline"$1>$2</Button>',
  );
  s = s.replace(
    /<button\s+className="btn btn-primary"([^>]*)>([\s\S]*?)<\/button>/g,
    '<Button variant="primary"$1>$2</Button>',
  );
  s = s.replace(
    /<button\s+className="btn btn-p"([^>]*)>([\s\S]*?)<\/button>/g,
    '<Button variant="primary"$1>$2</Button>',
  );
  s = s.replace(
    /<button\s+className="btn btn-d btn-xs"([^>]*)>([\s\S]*?)<\/button>/g,
    '<Button variant="danger" size="xs"$1>$2</Button>',
  );
  s = s.replace(
    /<button\s+className="btn btn-sm btn-outline"([^>]*)>([\s\S]*?)<\/button>/g,
    '<Button variant="outline" size="sm"$1>$2</Button>',
  );
  s = s.replace(
    /<button\s+className="btn btn-sm"([^>]*)>([\s\S]*?)<\/button>/g,
    '<Button variant="secondary" size="sm"$1>$2</Button>',
  );

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('fixed:', path.relative(viewsDir, file));
  }
}
