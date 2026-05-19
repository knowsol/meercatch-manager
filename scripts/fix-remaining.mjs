import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const viewsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/views');
const closeDiv = (indent) => indent + '</' + 'motion.div>'.replace('motion.', '');

function setLine(file, lineNum, content) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines[lineNum - 1] = content;
  fs.writeFileSync(file, lines.join('\r\n'));
}

// Components card section
setLine('src/views/components/Components.tsx', 185, '          </FilterBar>');
setLine('src/views/components/Components.tsx', 240, closeDiv('              '));
setLine('src/views/components/Components.tsx', 241, closeDiv('            '));
setLine('src/views/components/Components.tsx', 242, '          </Card>');
setLine('src/views/components/Components.tsx', 243, closeDiv('        '));

// DetectionList FilterBar
setLine('src/views/detections/DetectionList.tsx', 196, '      </FilterBar>');

// Fix button/Button on cx buttons
function fixCxButtons(file) {
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(/<button className="cx"([^>]*)>([^<]*)<\/Button>/g, '<button className="cx"$1>$2</button>');
  fs.writeFileSync(file, s);
}
fixCxButtons('src/views/detections/DetectionDetailPanel.tsx');
fixCxButtons('src/views/devices/DeviceDetailPanel.tsx');

// DetectionList select/Select mismatch - use Select throughout filter bar
let det = fs.readFileSync('src/views/detections/DetectionList.tsx', 'utf8');
det = det.replace(
  /<FilterBar>[\s\S]*?<\/FilterBar>/,
  `<FilterBar>
        <Input type="search" placeholder="URL 검색..."
          value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
        <Select style={{ maxWidth: 140 }} value={osFilter} onChange={(e) => { setOsFilter(e.target.value); setPage(0); }}>
          <option value="">전체 OS</option>
          {Object.entries(DETECT_OS_TYPE_MAP).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </Select>
        <Input type="date" style={{ maxWidth: 160 }} value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setPage(0); }} />
        <span style={{ color: 'var(--t3)', fontSize: 12 }}>~</span>
        <Input type="date" style={{ maxWidth: 160 }} value={endDate}
          onChange={(e) => { setEndDate(e.target.value); setPage(0); }} />
        <Button variant="outline" onClick={handleSearch}>검색</Button>
      </FilterBar>`,
);
if (!det.includes("from '@/components/ui'")) {
  det = det.replace(
    /^(import[\s\S]*?from ['"]@\/types['"];?\r?\n)/,
    "$1import { PageHeader, Grid4, KPI, FilterBar, Input, Select, Button } from '@/components/ui';\n",
  );
}
fs.writeFileSync('src/views/detections/DetectionList.tsx', det);

console.log('remaining fixes done');
