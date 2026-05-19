import fs from 'fs';

let s = fs.readFileSync('src/views/Dashboard.tsx', 'utf8');

s = s.replace(
  /<Card className="section-gap">([\s\S]*?)\n      <\/div>\n\n      \{isDirect &&/,
  '<Card className="section-gap">$1\n      </Card>\n\n      {isDirect &&',
);

s = s.replace(
  /<Card className="mt-20">([\s\S]*?)\n        <\/motion.div>\n      \)\}/,
  '<Card className="mt-20">$1\n        </Card>\n      )}',
);
s = s.replace(
  /<Card className="mt-20">([\s\S]*?)\n        <\/div>\n      \)\}/,
  '<Card className="mt-20">$1\n        </Card>\n      )}',
);

s = s.replace(
  /(\{activePauses\.length > 0 \?[\s\S]*?\)\}\n)          <\/motion.div>\n\n          <Card>/,
  '$1          </Card>\n\n          <Card>',
);
s = s.replace(
  /(\{activePauses\.length > 0 \?[\s\S]*?\)\}\n)          <\/motion.div>\n\n          <Card>/,
  '$1          </Card>\n\n          <Card>',
);
s = s.replace(
  /(<Card>\s*<CardTitle>라이선스 현황<\/CardTitle>[\s\S]*?)\n          <\/motion.div>\n        <\/motion.div>\n      \)\}/,
  '$1\n          </Card>\n        </div>\n      )}',
);
s = s.replace(
  /(<Card>\s*<CardTitle>라이선스 현황<\/CardTitle>[\s\S]*?)\n          <\/div>\n        <\/div>\n      \)\}/,
  '$1\n          </Card>\n        </motion.div>\n      )}',
);

fs.writeFileSync('src/views/Dashboard.tsx', s);

let c = fs.readFileSync('src/views/components/Components.tsx', 'utf8');
c = c.replace(/(\{children\}\r?\n)    <\/div>(\r?\n  \);)/, '$1    </Card>$2');
c = c.replace(/(<FilterBar[\s\S]*?<\/Select>\r?\n)          <\/div>/, '$1          </FilterBar>');
c = c.replace(/(<Card>\s*<CardTitle>카드 제목<\/CardTitle>[\s\S]*?<\/p>\s*)<\/motion.div>/, '$1</Card>');
c = c.replace(/(<Card>\s*<CardTitle>카드 제목<\/CardTitle>[\s\S]*?<\/p>\s*)<\/div>/, '$1</Card>');
c = c.replace(/(<Card>\s*<CardTitle>진행률 예시<\/CardTitle>[\s\S]*?)          <\/motion.div>\s*<\/motion.div>/, '$1          </Card>\n        </div>');
c = c.replace(/(<Card>\s*<CardTitle>진행률 예시<\/CardTitle>[\s\S]*?)          <\/motion.div>\s*<\/motion.div>/, '$1          </Card>\n        </div>');
c = c.replace(/(<Card>\s*<CardTitle>진행률 예시<\/CardTitle>[\s\S]*?)          <\/div>\s*<\/div>/, '$1          </Card>\n        </div>');
fs.writeFileSync('src/views/components/Components.tsx', c);

console.log('fixed');
