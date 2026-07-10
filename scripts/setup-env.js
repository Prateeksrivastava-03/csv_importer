const fs = require('fs');
const path = require('path');

/**
 * Copies each example env file to its real name if the real file doesn't
 * exist yet. Safe to run repeatedly - never overwrites an existing .env.
 */
const targets = [
  {
    example: path.join(__dirname, '..', 'backend', '.env.example'),
    real: path.join(__dirname, '..', 'backend', '.env'),
  },
  {
    example: path.join(__dirname, '..', 'frontend', '.env.local.example'),
    real: path.join(__dirname, '..', 'frontend', '.env.local'),
  },
];

let createdAny = false;

targets.forEach(({ example, real }) => {
  if (fs.existsSync(real)) {
    console.log(`[setup] ${path.relative(process.cwd(), real)} already exists, skipping.`);
    return;
  }
  if (!fs.existsSync(example)) {
    console.warn(`[setup] Warning: ${example} not found, cannot create ${real}.`);
    return;
  }
  fs.copyFileSync(example, real);
  createdAny = true;
  console.log(`[setup] Created ${path.relative(process.cwd(), real)} from ${path.basename(example)}`);
});

if (createdAny) {
  console.log('\n[setup] Done. IMPORTANT: open backend/.env and set your real OPENAI_API_KEY before importing.');
} else {
  console.log('\n[setup] All env files already present. Nothing to do.');
}
