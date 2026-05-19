import fs from 'fs';

const lines = fs.readFileSync('src/views/components/Components.tsx', 'utf8').split(/\r?\n/);

lines[184] = '          </FilterBar>';
lines[239] = '              </' + 'div>';
lines[240] = '            </' + 'motion.div>'.replace('motion.', '');
lines[241] = '          </Card>';
lines[242] = '        </' + 'motion.div>'.replace('motion.', '');

fs.writeFileSync('src/views/components/Components.tsx', lines.join('\r\n'));
console.log('Components fixed', lines.slice(238, 244));
