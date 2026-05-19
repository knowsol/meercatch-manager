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

  s = s.replace(/<Input type="search"([^>]*?) type="text"/g, '<Input type="search"$1');
  s = s.replace(/<\/select>/gi, '</Select>');
  s = s.replace(/subtitle=\{"총 \{totalCount\}([^"]*)"\}/g, 'subtitle={`총 ${totalCount}$1`}');
  s = s.replace(/subtitle=\{"총 \{meta\?\.totalCount[^"]*"\}/g, 'subtitle={`총 ${meta?.totalCount ?? 0}개 라이선스 등록`}');

  // Fix FilterBar closed with </motion.div> or </div> when Select inside
  s = s.replace(/(<FilterBar[\s\S]*?<\/Select>)\s*<\/motion.div>/g, '$1\n      </FilterBar>');
  s = s.replace(/(<FilterBar[\s\S]*?<\/Select>)\s*<\/div>\s*\n\s*<DataTable/g, '$1\n      </FilterBar>\n\n      <DataTable');

  // Fix broken button/Button mismatch in Licenses
  s = s.replace(
    /<button\n(\s+className="btn btn-p"[\s\S]*?)\n\s*>\n([^<]+)\n\s*<\/Button>/g,
    '<Button variant="primary"\n$1\n          >\n$2\n          </Button>',
  );

  s = s.replace(/<Kpi\b/g, '<KPI');
  s = s.replace(/<\/Kpi>/g, '</KPI>');

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('fixed:', path.relative(viewsDir, file));
  }
}
