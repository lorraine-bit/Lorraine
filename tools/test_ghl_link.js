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

async function testGhl() {
    const url = process.env.GHL_WEBHOOK_URL;
    if (!url) {
        console.error('Error: GHL_WEBHOOK_URL not found');
        return;
    }

    const payload = { test: 'handshake', system: 'B.L.A.S.T. Pilot (Node.js)' };
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            console.log(`? GHL Link Verified: ${response.status}`);
        } else {
            console.error(`? GHL Link Failed: ${response.status} - ${await response.text()}`);
        }
    } catch (e) {
        console.error(`? GHL Link Error: ${e.message}`);
    }
}

testGhl();
