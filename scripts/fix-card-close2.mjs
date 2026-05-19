import fs from 'fs';

const fixes = [
  {
    file: 'src/views/Dashboard.tsx',
    replacements: [
      [
        /(<Card className="section-gap">[\s\S]*?<\/Table>\s*)\n      <\/div>/,
        '$1\n      </Card>',
      ],
      [
        /(<Card className="mt-20">[\s\S]*?<\/dl>[\s\S]*?<\/motion.div>\s*<\/motion.div>\s*<\/motion.div>\s*)\n        <\/div>\s*\n      \)\}/,
        (m) => m.replace(/<\/div>\s*$/, '</Card>\n      )}').replace(/<\/motion.div>\s*<\/motion.div>\s*$/, '</div>\n          </div>'),
      ],
    ],
  },
];

// Simpler: line-based fixes for Dashboard
let dash = fs.readFileSync('src/views/Dashboard.tsx', 'utf8');
dash = dash.replace(
  /(\n        \/>\n)      <\/div>(\n\n      \{isDirect)/,
  '$1      </Card>$2',
);
dash = dash.replace(
  /(\n          <\/div>\n        <\/motion.div>\n      \)\}\n\n      \{\!isDirect)/,
  '\n          </motion.div>\n        </Card>\n      )}\n\n      {!isDirect',
);
// Fix isDirect card end
dash = dash.replace(
  /(<Card className="mt-20">[\s\S]*?progress-fill[\s\S]*?\/>\n              \/>\n            <\/motion.div>\n          <\/motion.div>\n        )<\/div>(\n      \)\})/,
  '$1</Card>$2',
);

let comp = fs.readFileSync('src/views/components/Components.tsx', 'utf8');
comp = comp.replace(
  /(\{children\}\n)    <\/motion.div>(\n  \);\n\}\n\nfunction Row)/,
  '$1    </Card>$2',
);
comp = comp.replace(
  /(\{children\}\n)    <\/motion.div>(\n  \);\n\}\n\nfunction Row)/,
  '$1    </Card>$2',
);
comp = comp.replace(/(\{children\}\n)    <\/div>(\n  \);\n\}\n\nfunction Row)/, '$1    </Card>$2');

fs.writeFileSync('src/views/Dashboard.tsx', dash);
fs.writeFileSync('src/views/components/Components.tsx', comp);
console.log('done');
