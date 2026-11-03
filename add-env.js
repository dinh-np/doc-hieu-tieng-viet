const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

function addEnv(key, value) {
  if (!value) {
    console.warn(`Skipping ${key} (not found in .env.local)`);
    return;
  }
  console.log(`Adding ${key}...`);
  try {
    execSync(`cmd /c "vercel env rm ${key} production,preview,development -y"`, { stdio: 'ignore' });
  } catch (e) {}
  try {
    execSync(`cmd /c "vercel env add ${key} production,preview,development --value \\"${value}\\" --yes"`, {
      stdio: 'inherit'
    });
  } catch(e) {
    console.error(`Failed to add ${key}`);
  }
}

addEnv('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
addEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
addEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
addEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);
addEnv('GEMINI_API_KEY', process.env.GEMINI_API_KEY);
console.log('Done!');
