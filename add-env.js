const { execSync } = require('child_process');

function addEnv(key, value) {
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

addEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
addEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'sb_publishable_wTyqZaAMIjsNKJvfbPVZMw_IUxWFjqt');
addEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://xbndmusvhpqnhbasonhv.supabase.co');
addEnv('SUPABASE_SERVICE_ROLE_KEY', 'sb_secret_EGf893cfFzAdSDMyO2AzkA_xVBD77eZ');
console.log('Done!');
