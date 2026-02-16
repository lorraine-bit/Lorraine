let currentStep = 1;
const totalSteps = 6;
const state = {
    contact: {},
    discovery: { currentCarrier: '', expDate: '', interests: [] },
    vehicles: [],
    drivers: [],
    home: {}
};

function updateProgress() {
    const fill = document.getElementById('progressFill');
    if (fill) {
        const progress = currentStep > 6 ? 100 : (currentStep / 6) * 100;
        fill.style.width = `${progress}%`;
    }
}

function showStep(stepNum) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`step${stepNum}`);
    if (target) target.classList.add('active');
    updateProgress();
    
    if (stepNum === 6) renderSummary();
}

function nextStep() {
    // Stage 1: Contact Validation
    if (currentStep === 1) {
        state.contact = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('params_phone').value,
            // Added Address Fields
            address1: document.getElementById('address1').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value,
            state: document.getElementById('state').value,
            postal_code: document.getElementById('postal_code').value
        };
        if (!state.contact.firstName || !state.contact.email) return alert('Please enter name and email.');
    }
    
    // Stage 2: Discovery Validation
    if (currentStep === 2) {
        const carrierEl = document.getElementById('currentCarrier');
        const expEl = document.getElementById('expDate');
        state.discovery.currentCarrier = carrierEl ? carrierEl.value : '';
        state.discovery.expDate = expEl ? expEl.value : '';
        if (state.discovery.interests.length === 0) return alert('Please select at least one insurance interest.');
    }

    // Branching Logic
    if (currentStep === 2 && !state.discovery.interests.includes('auto')) {
        currentStep = 5; // Skip Auto steps (3 & 4) if only Home selected
    } else if (currentStep === 4 && !state.discovery.interests.includes('home')) {
        currentStep = 6; // Skip Home step (5) if only Auto selected
    } else {
        if (currentStep < totalSteps) currentStep++;
    }
    
    showStep(currentStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
    if (currentStep === 5 && !state.discovery.interests.includes('auto')) {
        currentStep = 2;
    } else if (currentStep === 4 && !state.discovery.interests.includes('home') && state.discovery.interests.includes.auto) {
        currentStep = 3;
    } else if (currentStep === 6 && !state.discovery.interests.includes('home') && state.discovery.interests.includes.auto) {
        currentStep = 4;
    } else if (currentStep === 6 && !state.discovery.interests.includes('home') && !state.discovery.interests.includes.auto) {
        currentStep = 2;
    } else {
        if (currentStep > 1) currentStep--;
    }
    showStep(currentStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleOption(type) {
    const opt = document.getElementById(`opt${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!opt) return;
    
    opt.classList.toggle('selected');
    if (state.discovery.interests.includes(type)) {
        state.discovery.interests = state.discovery.interests.filter(i => i !== type);
    } else {
        state.discovery.interests.push(type);
    }
}

function addVehicle() {
    if (state.vehicles.length >= 4) return alert('Max 4 vehicles.');
    const id = Date.now();
    state.vehicles.push({ id, year: '', make: '', model: '', vin: '' });
    renderVehicles();
}

function renderVehicles() {
    const list = document.getElementById('vehicleList');
    if (!list) return;
    list.innerHTML = state.vehicles.map((v, i) => `
        <div class="dynamic-card">
            <label>Vehicle ${i+1}</label>
            <div class="input-row" style="margin-bottom: 12px;">
                <input type="text" placeholder="Year" value="${v.year}" onchange="updateVehicle(${v.id}, 'year', this.value)">
                <input type="text" placeholder="Make / Model" value="${v.make}" onchange="updateVehicle(${v.id}, 'make', this.value)">
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label style="font-size: 0.65rem;">VIN / Serial Number</label>
                <input type="text" placeholder="Enter VIN" value="${v.vin}" onchange="updateVehicle(${v.id}, 'vin', this.value)" required>
            </div>
        </div>
    `).join('');
}

function updateVehicle(id, field, val) {
    const v = state.vehicles.find(x => x.id === id);
    if (v) v[field] = val;
}

function addDriver() {
    if (state.drivers.length >= 4) return alert('Max 4 drivers.');
    const id = Date.now();
    state.drivers.push({ id, name: '', dob: '', license: '', state: '' });
    renderDrivers();
}

function renderDrivers() {
    const list = document.getElementById('driverList');
    if (!list) return;
    list.innerHTML = state.drivers.map((d, i) => `
        <div class="dynamic-card">
            <label>Driver ${i + 1}</label>
            <div class="input-group">
                <input type="text" placeholder="Full Name" value="${d.name}" onchange="updateDriver(${d.id}, 'name', this.value)">
            </div>
            <div class="input-row">
                <div class="input-group" style="margin-bottom:0; flex: 1.5;">
                    <label style="font-size: 0.65rem; color: rgba(255,255,255,0.5);">Date of Birth</label>
                    <input type="date" value="${d.dob}" onchange="updateDriver(${d.id}, 'dob', this.value)">
                </div>
                <div class="input-group" style="margin-bottom:0;">
                    <label style="font-size: 0.65rem; color: rgba(255,255,255,0.5);">License #</label>
                    <input type="text" placeholder="License #" value="${d.license}" onchange="updateDriver(${d.id}, 'license', this.value)">
                </div>
                <div class="input-group" style="margin-bottom:0; flex: 0.5;">
                    <label style="font-size: 0.65rem; color: rgba(255,255,255,0.5);">State</label>
                    <input type="text" placeholder="NV" value="${d.state}" onchange="updateDriver(${d.id}, 'state', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

function updateDriver(id, field, val) {
    const d = state.drivers.find(x => x.id === id);
    if (d) d[field] = val;
}

function renderSummary() {
    const area = document.getElementById('reviewSummary');
    if (!area) return;

    let vehicleHtml = state.vehicles.length > 0 ? `<div style="margin-top:10px;"><strong>Vehicles (${state.vehicles.length}):</strong><br>${state.vehicles.map(v => `${v.year} ${v.make} (VIN: ${v.vin || 'Pending'})`).join('<br>')}</div>` : '';
    let driverHtml = state.drivers.length > 0 ? `<div style="margin-top:10px;"><strong>Drivers (${state.drivers.length}):</strong><br>${state.drivers.map(d => `${d.name} (${d.dob ? 'DOB: ' + d.dob + ' | ' : ''}${d.state} Lic: ${d.license || 'Pending'})`).join('<br>')}</div>` : '';

    area.innerHTML = `
        <div class="summary-item"><strong>Contact:</strong> ${state.contact.firstName} ${state.contact.lastName}</div>
        <div class="summary-item" style="font-size: 0.8rem; color: var(--text-muted);">
            ${state.contact.address1}, ${state.contact.city}, ${state.contact.country}, ${state.contact.state} ${state.contact.postal_code}
        </div>
        <div class="summary-item"><strong>Interests:</strong> ${state.discovery.interests.join(', ')}</div>
        ${vehicleHtml}
        ${driverHtml}
        ${state.discovery.interests.includes('home') ? `
        <div class="summary-item" style="margin-top:10px;"><strong>Home Details:</strong><br>${document.getElementById('homeAddress')?.value || 'N/A'}<br>Built: ${document.getElementById('homeYear')?.value || 'N/A'}, ${document.getElementById('homeSqFt')?.value || 'N/A'} sqft</div>
        ` : ''}
    `;
    area.style.background = 'rgba(255,255,255,0.05)';
    area.style.padding = '20px';
    area.style.borderRadius = '16px';
    area.style.fontSize = '0.9rem';
    area.style.lineHeight = '1.6';
}

async function submitForm() {
    const btn = document.querySelector('.btn.pulse');
    const originalText = btn.textContent;
    btn.textContent = 'Securing My Request...';
    btn.disabled = true;

    if (state.discovery.interests.includes('home')) {
        state.home = {
            address: document.getElementById('homeAddress')?.value || '',
            yearBuilt: document.getElementById('homeYear')?.value || '',
            sqFt: document.getElementById('homeSqFt')?.value || ''
        };
    }

    const payload = {
        source: 'RDP Landing Page Intake - Premium',
        ...state.contact,
        ...state.discovery,
        vehicles: state.vehicles,
        drivers: state.drivers,
        home: state.home,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch('https://services.leadconnectorhq.com/hooks/Q0SUs2gjxZuOIboKSyUx/webhook-trigger/61a36a48-14cd-4624-9e26-9ba3882ee9e2', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            currentStep = 7;
            showStep(7);
            fireConfetti();
        } else {
            throw new Error('Webhook error');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        alert('We encountered an issue submitting your request. Please try again or contact Lorraine directly at 702-665-7011.');
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function fireConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#e75025', '#446d82'] }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#e75025', '#446d82'] }));
    }, 250);
}

// Global initialization errors check
window.onerror = function(msg, url, line) {
    console.error(`JS Error: ${msg} at ${line}`);
    return true;
};
