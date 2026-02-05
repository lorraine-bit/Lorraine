console.log('--- RDP SCRIPT V7 LOADED ---');

document.addEventListener('DOMContentLoaded', () => {
    console.log('--- DOM READY (V7 Full Sync) ---');

    let currentStep = 1;
    const totalSteps = 6;
    const form = document.getElementById('rdp-intake-form');
    const progressBar = document.getElementById('progress-bar');
    const successContainer = document.getElementById('success-container');

    const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/Q0SUs2gjxZuOIboKSyUx/webhook-trigger/61a36a48-14cd-4624-9e26-9ba3882ee9e2';

    function showStep(step) {
        console.log(`NAVIGATING: Step ${step}`);
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (activeStep) activeStep.classList.add('active');

        if (progressBar) {
            const progress = (step / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('next-btn')) {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        } else if (e.target.classList.contains('prev-btn')) {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        }
    });

    function validateStep(step) {
        console.log(`VALIDATING: Step ${step}`);
        const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!activeStep) return true;

        const inputs = activeStep.querySelectorAll('input[required], select[required]');
        let stepValid = true;
        let errorFields = [];

        inputs.forEach(input => {
            const val = input.value ? input.value.trim() : "";
            const fieldLabel = input.name || input.id || "Unknown";

            let fieldValid = true;
            if (!val || (input.type === 'checkbox' && !input.checked)) {
                fieldValid = false;
            } else if (input.type === 'email' && !val.includes('@')) {
                fieldValid = false;
            }

            if (!fieldValid) {
                stepValid = false;
                errorFields.push(fieldLabel.replace(/_/g, ' '));
                input.style.border = '2px solid #e75025';
            } else {
                input.style.border = '';
            }
        });

        if (!stepValid) alert('Please check: ' + errorFields.join(', '));
        return stepValid;
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Core Contact Info
            const firstName = data.first_name || document.getElementById('first-name')?.value || '';
            const lastName = data.last_name || document.getElementById('last-name')?.value || '';
            const phone = data.phone_number || document.getElementById('phone')?.value || '';
            const email = data.email || document.getElementById('email')?.value || '';

            // Payload Structure (Standardizing on Snake Case for GHL Custom Fields)
            const payload = {
                source: 'RDP Landing Page - Desktop Final V7',
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                street: data.street || '',
                city: data.city || '',
                state: data.state || '',
                zip: data.zip || '',

                current_carrier: data.current_carrier || '',
                accidents_5_years: data.accidents_5_years || 'No',
                at_fault_5_years: data.at_fault_5_years || 'No',
                timestamp: new Date().toISOString()
            };

            // Dynamic Drivers & Vehicles 1-4 (Matching your exact screenshots)
            for (let i = 1; i <= 4; i++) {
                // Drivers (From previous screenshot)
                payload[`driver_${i}_name`] = data[`driver_${i}_name`] || '';
                payload[`driver_${i}_dob`] = data[`driver_${i}_dob`] || '';
                payload[`driver_${i}_dl_state`] = data[`driver_${i}_state`] || '';
                payload[`driver_${i}_dl_number`] = data[`driver_${i}_license`] || '';

                // Vehicles (From this screenshot: VIN, Year, Make)
                payload[`vehicle_${i}_vin`] = data[`vehicle_${i}_vin`] || '';
                payload[`vehicle_${i}_year`] = data[`vehicle_${i}_year`] || '';
                payload[`vehicle_${i}_make`] = data[`vehicle_${i}_make`] || '';
                payload[`vehicle_${i}_model`] = data[`vehicle_${i}_model`] || ''; // Including model as backup
            }

            console.log('--- SENDING V7 PAYLOAD (Vehicle/Driver Sync) ---', payload);

            const response = await fetch(GHL_WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none';
                if (successContainer) successContainer.style.display = 'block';
                fireConfetti();
            } else {
                throw new Error(`GHL Error ${response.status}`);
            }
        } catch (err) {
            console.error('SUBMIT FAILED:', err);
            alert('Submission failed. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Review My Coverage';
        }
    });

    function fireConfetti() {
        if (typeof confetti !== 'function') return;
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#e75025', '#446d82'] }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#e75025', '#446d82'] }));
        }, 250);
    }
});
