import fs from 'fs';

const path = 'src/views/Dashboard.tsx';
const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);

const fixes = {
  238: '      </Card>',
  270: '        </Card>',
  298: '          </Card>',
  318: '          </Card>',
};

let changed = 0;
for (const [idx, exp] of Object.entries(fixes)) {
  const i = Number(idx);
  if (lines[i] !== exp) {
    console.log(`line ${i + 1}: ${JSON.stringify(lines[i])} -> ${exp}`);
    lines[i] = exp;
    changed++;
  }
}

if (changed) fs.writeFileSync(path, lines.join('\r\n'));
console.log('changed', changed);
