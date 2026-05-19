import fs from 'fs';

for (const file of ['src/views/validurl/ValidUrlList.tsx', 'src/views/validurl/ValidUrlListV2.tsx']) {
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(
    /<button variant="primary" onClick=\{handleSearch\}>\s*조회\s*<\/button>\s*<\/div>/g,
    '<Button variant="primary" onClick={handleSearch}>\n          조회\n        </Button>\n      </FilterBar>',
  );
  fs.writeFileSync(file, s);
  console.log('fixed', file);
}
