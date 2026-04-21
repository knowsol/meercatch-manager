export const fmtD = (d: string | null | undefined): string => {
  if (!d) return '—';
  const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : String(d);
};

export const fmtDT = (d: string | null | undefined): string => {
  if (!d) return '—';
  const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]} ${m[4]}:${m[5]}` : String(d);
};
