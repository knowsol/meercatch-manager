import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewsDir = path.join(__dirname, '../src/views');

const badgeClsMap = {
  'bdg-ok': 'ok',
  'bdg-err': 'err',
  'bdg-warn': 'warn',
  'bdg-muted': 'muted',
  'bdg-ac': 'ac',
};

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function migrate(content, filePath) {
  let s = content;

  // Badge cls -> variant
  for (const [cls, variant] of Object.entries(badgeClsMap)) {
    s = s.replaceAll(`cls="${cls}"`, `variant="${variant}"`);
    s = s.replaceAll(`cls={\`${cls}\`}`, `variant="${variant}"`);
    s = s.replaceAll(`cls={'${cls}'}`, `variant="${variant}"`);
  }
  // ROLE_CLS patterns like cls={ROLE_CLS[role] || 'bdg-muted'}
  s = s.replace(/cls=\{ROLE_CLS\[(\w+)\] \|\| 'bdg-muted'\}/g, 'variant={ROLE_VARIANT[$1] || \'muted\'}');
  s = s.replace(/cls=\{(\w+) === 'admin' \? 'bdg-ac' : \1 === 'staff' \? 'bdg-ok' : 'bdg-muted'\}/g,
    'variant={$1 === \'admin\' ? \'ac\' : $1 === \'staff\' ? \'ok\' : \'muted\'}');

  // common imports -> @/components/ui
  s = s.replace(/from ['"]\.\.\/\.\.\/components\/common\/Badge['"]/g, "from '@/components/ui'");
  s = s.replace(/from ['"]\.\.\/components\/common\/Badge['"]/g, "from '@/components/ui'");
  s = s.replace(/from ['"]\.\.\/\.\.\/\.\.\/components\/common\/Badge['"]/g, "from '@/components/ui'");
  s = s.replace(/from ['"]\.\.\/\.\.\/components\/common\/KPI['"]/g, "from '@/components/ui'");
  s = s.replace(/from ['"]\.\.\/components\/common\/KPI['"]/g, "from '@/components/ui'");
  s = s.replace(/import Kpi from ['"][^'"]+KPI['"]/g, "import { KPI } from '@/components/ui'");
  s = s.replace(/import KPI from ['"][^'"]+KPI['"]/g, "import { KPI } from '@/components/ui'");
  s = s.replace(/import Kpi from ['"][^'"]+KPI['"]/g, "import { KPI } from '@/components/ui'");

  // Merge Badge imports into ui import block when both exist - simplified: dedupe later

  // Buttons
  s = s.replace(/<button className="btn btn-p btn-sm"/g, '<Button variant="primary" size="sm"');
  s = s.replace(/<button className="btn btn-p"/g, '<Button variant="primary"');
  s = s.replace(/<button className="btn btn-primary btn-sm"/g, '<Button variant="primary" size="sm"');
  s = s.replace(/<button className="btn btn-primary"/g, '<Button variant="primary"');
  s = s.replace(/<button className="btn btn-outline btn-sm"/g, '<Button variant="outline" size="sm"');
  s = s.replace(/<button className="btn btn-outline"/g, '<Button variant="outline"');
  s = s.replace(/<button className="btn btn-s btn-sm"/g, '<Button variant="secondary" size="sm"');
  s = s.replace(/<button className="btn btn-s"/g, '<Button variant="secondary"');
  s = s.replace(/<button className="btn btn-d btn-sm"/g, '<Button variant="danger" size="sm"');
  s = s.replace(/<button className="btn btn-d"/g, '<Button variant="danger"');
  s = s.replace(/<button className="btn btn-warn"/g, '<Button variant="warn"');
  s = s.replace(/<button className="btn btn-ok"/g, '<Button variant="ok"');
  s = s.replace(/<\/button>/g, '</Button>');

  // Grids
  s = s.replace(/className="grid-4 /g, 'className="');
  s = s.replace(/className="grid-3 /g, 'className="');
  s = s.replace(/className="grid-2 /g, 'className="');
  s = s.replace(/className="grid-4"/g, '');
  s = s.replace(/className="grid-3"/g, '');
  s = s.replace(/className="grid-2"/g, '');

  // Remove section divider comments
  s = s.replace(/\s*\/\/ =+[^\n]*\n/g, '\n');
  s = s.replace(/\s*\/\* =+[\s\S]*?\*\/\n/g, '\n');

  return s;
}

for (const file of walk(viewsDir)) {
  if (file.includes('notifications')) continue; // already migrated manually
  const orig = fs.readFileSync(file, 'utf8');
  const next = migrate(orig, file);
  if (next !== orig) {
    fs.writeFileSync(file, next);
    console.log('updated:', path.relative(viewsDir, file));
  }
}
