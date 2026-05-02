const fs = require('fs');
const esbuild = require('esbuild');

const files = [
  'navigation.tsx',
  'hero-section.tsx',
  'features-section.tsx',
  'testimonials-section.tsx',
  'cta-section.tsx',
  'footer-section.tsx'
];

async function run() {
  for (const f of files) {
    const c = fs.readFileSync('../landing/components/landing/'+f, 'utf-8');
    const r = await esbuild.transform(c, { loader: 'tsx', jsx: 'preserve' });
    const n = f.replace('.tsx', '.jsx').split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
    fs.writeFileSync('./src/components/landing/'+n, r.code.replace(/\"use client\";\n/g, ''));
    console.log(n);
  }
}
run();
