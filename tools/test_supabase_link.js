const fs = require('fs');

function loadEnv() {
    try {
        const env = fs.readFileSync('.env', 'utf8');
        env.split('\n').forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key && rest.length > 0) process.env[key.trim()] = rest.join('=').trim();
        });
    } catch (e) {}
}

loadEnv();

async function testSupabase() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        console.error('Error: Supabase credentials missing');
        return;
    }

    try {
        const response = await fetch(`${url}/rest/v1/leads?select=id&limit=1`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        if (response.ok) {
            console.log(`? Supabase Link Verified: ${response.status}`);
        } else {
            console.error(`? Supabase Link Failed: ${response.status} - ${await response.text()}`);
        }
    } catch (e) {
        console.error(`? Supabase Link Error: ${e.message}`);
    }
}

testSupabase();
