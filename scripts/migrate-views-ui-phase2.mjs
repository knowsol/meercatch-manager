import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewsDir = path.join(__dirname, '../src/views');

const UI_EXPORTS = [
  'Button', 'PageHeader', 'Card', 'CardTitle', 'Input', 'Select', 'Textarea',
  'FormGroup', 'FormRow', 'CheckboxRow', 'DetailSection', 'Divider', 'InfoRow',
  'FilterBar', 'Grid2', 'Grid3', 'Grid4', 'Tabs', 'EmptyState', 'Alert',
  'KPI', 'Badge', 'StatusBadge', 'DetTypeBadge',
];

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function ensureUiImports(content) {
  let s = content;
  s = s.replace(/^import KPI from ['"]@\/components\/ui['"];?\r?\n/gm, '');
  s = s.replace(/^import Kpi from ['"]@\/components\/ui['"];?\r?\n/gm, '');
  s = s.replace(/^import \{([^}]+)\} from ['"]@\/components\/ui['"];?\r?\n/gm, '');

  const needed = UI_EXPORTS.filter((name) => new RegExp(`<${name}[\\s/>]`).test(s));
  if (!needed.length) return s;

  const line = `import { ${needed.join(', ')} } from '@/components/ui';\n`;
  const m = s.match(/^(?:'use client'|"use client");?\r?\n/);
  if (m) {
    const rest = s.slice(m[0].length);
    const imports = rest.match(/^(?:import .+\r?\n)+/);
    if (imports) {
      return m[0] + imports[0] + line + rest.slice(imports[0].length);
    }
    return m[0] + line + rest;
  }
  const imports = s.match(/^(?:import .+\r?\n)+/);
  if (imports) return imports[0] + line + s.slice(imports[0].length);
  return line + s;
}

function migratePh(content) {
  return content.replace(
    /<div className="ph">\s*<motion.div className="ph-left">\s*<div className="ph-title">([\s\S]*?)<\/div>\s*<div className="ph-sub">([\s\S]*?)<\/div>\s*<\/div>\s*<div className="ph-actions">\s*([\s\S]*?)<\/motion.div>\s*<\/motion.div>/g,
    (_, title, subtitle, actions) =>
      `<PageHeader title={${JSON.stringify(title.trim())}} subtitle={${JSON.stringify(subtitle.trim())}} actions={<>${actions.trim()}</>} />`,
  ).replace(
    /<div className="ph">\s*<div className="ph-left">\s*<motion.div className="ph-title">([\s\S]*?)<\/div>\s*<div className="ph-sub">([\s\S]*?)<\/div>\s*<\/div>\s*<div className="ph-actions">\s*([\s\S]*?)<\/div>\s*<\/div>/g,
    (_, title, subtitle, actions) =>
      `<PageHeader title={${JSON.stringify(title.trim())}} subtitle={${JSON.stringify(subtitle.trim())}} actions={<>${actions.trim()}</>} />`,
  ).replace(
    /<div className="ph">\s*<div className="ph-left">\s*<div className="ph-title">([\s\S]*?)<\/div>\s*<div className="ph-sub">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g,
    (_, title, subtitle) =>
      `<PageHeader title={${JSON.stringify(title.trim())}} subtitle={${JSON.stringify(subtitle.trim())}} />`,
  );
}

function migrateFb(content) {
  return content.replace(/<div className="fb"/g, '<FilterBar');
}

function migrateGrid4Kpi(content) {
  return content.replace(
    /<div className="section-gap">\s*((?:<KPI[\s\S]*?\/>\s*)+)<\/div>/g,
    '<Grid4 className="section-gap">$1</Grid4>',
  ).replace(
    /<div className="section-gap">\s*((?:<Kpi[\s\S]*?\/>\s*)+)<\/div>/g,
    '<Grid4 className="section-gap">$1</Grid4>',
  );
}

function migrateRoleVariant(content) {
  return content
    .replace(
      /const ROLE_CLS: Record<AccountRole, string> = \{[\s\S]*?\};/,
      `const ROLE_VARIANT: Record<AccountRole, 'err' | 'ac' | 'ok' | 'muted'> = {
  SUPER_ADMIN: 'err',
  ADMIN: 'ac',
  MANAGER: 'ok',
  USER: 'muted',
};`,
    )
    .replace(/ROLE_CLS\[(\w+)\]/g, 'ROLE_VARIANT[$1]')
    .replace(/bdg-muted/g, 'muted')
    .replace(/bdg-err/g, 'err')
    .replace(/bdg-ok/g, 'ok')
    .replace(/bdg-ac/g, 'ac')
    .replace(/bdg-warn/g, 'warn');
}

function migrateInputs(content) {
  let s = content;
  s = s.replace(/<input className="inp search"/g, '<Input type="search"');
  s = s.replace(/<input className="inp"/g, '<Input');
  s = s.replace(/<select className="inp"/g, '<Select');
  s = s.replace(/<textarea className="inp"/g, '<Textarea');
  return s;
}

function migrateCard(content) {
  return content
    .replace(/<div className="card"([^>]*)>/g, '<Card$1>')
    .replace(/<div className="card-title"([^>]*)>/g, '<CardTitle$1>')
    .replace(/<div className="detail-section">/g, '<DetailSection>')
    .replace(/<div className="detail-section-title">([^<]+)<\/div>/g, '')
    .replace(/<hr className="divider"\s*\/>/g, '<Divider />')
    .replace(/<div className="divider"\s*\/>/g, '<Divider />')
    .replace(/<label className="checkbox-row([^"]*)">/g, '<CheckboxRow className="$1">')
    .replace(/<div className="fg">/g, '<FormGroup>');
}

for (const file of walk(viewsDir)) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  s = migratePh(s);
  s = migrateFb(s);
  s = migrateGrid4Kpi(s);
  s = migrateRoleVariant(s);
  s = migrateInputs(s);
  s = migrateCard(s);
  s = ensureUiImports(s);
  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('phase2:', path.relative(viewsDir, file));
  }
}
