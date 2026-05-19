import fs from 'fs';

const p = 'src/views/licenses/License2Mock.tsx';
let s = fs.readFileSync(p, 'utf8');

const start = s.indexOf('      <PageHeader title={"라이선스"}');
const end = s.indexOf('      ) : (', start);
if (start < 0 || end < 0) {
  console.error('markers not found', start, end);
  process.exit(1);
}

const replacement = `      <PageHeader
        title="라이선스"
        subtitle={\`총 \${allGroups.length}개 사업 · OS 라이선스 \${allGroups.reduce((n, g) => n + g.lines.length, 0)}건\`}
        actions={
          <Button
            variant="primary"
            onClick={() =>
              toast("라이선스 등록은 관리자에게 문의하세요.", "info")
            }
          >
            + 라이선스 등록
          </Button>
        }
      />

      <Grid4 className="section-gap">
        <KPI label="총 수량" value={totalQty} sub="등록된 전체 라이선스" />
        <KPI
          label="단말기 사용 중"
          value={totalUsed}
          sub={\`\${usedPct}% 사용\`}
          color={kpiColor}
        />
        <KPI label="잔여" value={remaining} sub="추가 등록 가능" color="ac" />
        <KPI
          label="사업 수"
          value={allGroups.length}
          sub="년도·벤더·차수 단위"
        />
      </Grid4>

      <FilterBar style={{ flexWrap: "wrap", gap: 10 }}>
        <Input
          type="search"
          placeholder="사업명 또는 라이선스 키 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Select
          id="license2-filter-year"
          style={{ maxWidth: 140 }}
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setRoundFilter("");
            setPage(0);
          }}
        >
          <option value="">전체 년도</option>
          {yearOptions.map((y) => (
            <option key={y} value={String(y)}>
              {y}년
            </option>
          ))}
        </Select>
        <Select
          id="license2-filter-round"
          style={{ maxWidth: 160 }}
          value={roundFilter}
          disabled={!yearFilter}
          aria-disabled={!yearFilter}
          onChange={(e) => {
            setRoundFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">
            {yearFilter ? "전체 차수" : "년도를 선택하세요"}
          </option>
          {roundOptionsForYear.map((r) => (
            <option key={r} value={String(r)}>
              {r}차
            </option>
          ))}
        </Select>
        <Button variant="outline" onClick={handleSearch}>
          검색
        </Button>
      </FilterBar>

      {filteredGroups.length === 0 ? (
        <div className="dt-wrap">
          <EmptyState icon="📜" title="조건에 맞는 라이선스가 없습니다" />
`;

s = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(p, s);
console.log('fixed License2Mock');
