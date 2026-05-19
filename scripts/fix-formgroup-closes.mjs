import fs from 'fs';

const fixes = {
  'src/views/groups/GroupDetailPanel.tsx': { 128: '                </FormGroup>', 134: '                </FormGroup>' },
  'src/views/policies/PolicyDetailPanel.tsx': {
    95: '        </FormGroup>',
    102: '        </FormGroup>',
    114: '            </motion.div>',
    115: '          </FormGroup>',
    127: '          </FormGroup>',
    149: '          </motion.div>',
    150: '        </motion.div>',
  },
};

const divClose = '</' + 'div>';

for (const [file, lineMap] of Object.entries(fixes)) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const [idx, content] of Object.entries(lineMap)) {
    const i = Number(idx);
    const fixed = content.replace(/<\/?motion\.div>/g, (m) => (m.startsWith('</') ? divClose : '<div'));
    console.log(file, i + 1, '->', fixed);
    lines[i] = fixed;
  }
  fs.writeFileSync(file, lines.join('\r\n'));
}
