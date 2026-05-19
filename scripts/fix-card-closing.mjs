import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const files = [
  'src/views/Dashboard.tsx',
  'src/views/components/Components.tsx',
];

for (const rel of files) {
  let s = fs.readFileSync(rel, 'utf8');
  const stack = [];
  const lines = s.split(/\r?\n/);
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const opens = [...line.matchAll(/<(Card|CardTitle)(\s|>)/g)];
    const closes = [...line.matchAll(/<\/(Card|CardTitle|div)>/g)];

    for (const o of opens) stack.push(o[1]);
    for (const c of closes) {
      const tag = c[1];
      if (tag === 'Card' || tag === 'CardTitle') {
        line = line.replace(c[0], `</${tag}>`);
      } else if (tag === 'motion.div' || tag === 'div') {
        const top = stack[stack.length - 1];
        if (top === 'Card' || top === 'CardTitle') {
          line = line.replace(c[0], `</${top}>`);
          stack.pop();
        }
      }
    }
    out.push(line);
  }

  fs.writeFileSync(rel, out.join('\n'));
  console.log('processed', rel);
}
