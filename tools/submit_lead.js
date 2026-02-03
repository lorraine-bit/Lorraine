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

async function submitToGhl(data) {
    const url = process.env.GHL_WEBHOOK_URL;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
}

async function submitToSupabase(data) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    const response = await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
    });
    return response.ok;
}

// Logic for Layer 2 to call
async function processLead(payload) {
    console.log('--- Submission Started ---');
    const ghlSuccess = await submitToGhl(payload.ghl_payload);
    console.log(`GHL: ${ghlSuccess ? '?' : '?'}`);
    
    const sbSuccess = await submitToSupabase(payload.supabase_payload);
    console.log(`Supabase: ${sbSuccess ? '?' : '?'}`);
    
    return ghlSuccess && sbSuccess;
}

module.exports = { processLead };
