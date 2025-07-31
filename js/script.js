document.addEventListener('DOMContentLoaded', function() {
    
    // --- GENERAL WEBSITE-WIDE SCRIPTS ---
    const navbar = document.querySelector('.header .navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }
    
    // --- PAGE-SPECIFIC INITIALIZATION ROUTER ---
   // --- PAGE-SPECIFIC INITIALIZATION ROUTER (Corrected) ---
const body = document.body;
if (body.id === 'login-page-body') {
    initLoginPage();
} else if (body.classList.contains('portal-body')) {
    // This now correctly handles the new NGO, Donor, and Volunteer portals
    initPortalPages(); 
} else if (body.id === 'campaign-details-page') {
    initCampaignDetailsPage();
} else if (body.id === 'transparency-page') {
    initTransparencyPage();
} else if (body.id === 'volunteer-page') {
    initVolunteerPage();
}
    // Note: The old 'dashboard-body' class is no longer used, so the old initDashboard is removed.

    // --- FUNCTION DEFINITIONS ---

    /**
     * Initializes functionality for the Login Page.
     */
    function initLoginPage() {
        const validCredentials = {
          ngo: { email: 'ngo@123', password: '111' },
          donor: { email: 'donor@123', password: '222' },
          volunteer: { email: 'volunteer@123', password: '333' },
          admin: { email: 'admin@123', password: '444' }
        };
        let isLogin = true;
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'user';
        const loginRoleSpan = document.getElementById('login-role');
        const formTitle = document.getElementById('form-title');
        const submitButton = document.getElementById('submit-button');
        const toggleText = document.getElementById('toggle-text');
        const toggleBtn = document.getElementById('toggle-form-btn');
        const loginForm = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorDiv = document.getElementById('error-message');

        loginRoleSpan.textContent = role;
        
        toggleBtn.addEventListener('click', () => {
            isLogin = !isLogin;
            errorDiv.classList.add('d-none');
            formTitle.textContent = isLogin ? 'Login' : 'Sign Up';
            submitButton.textContent = isLogin ? 'Login' : 'Create Account';
            toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
            toggleBtn.textContent = isLogin ? 'Sign Up' : 'Login';
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.classList.add('d-none');
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (isLogin) {
                const expectedCreds = validCredentials[role];
                if (!expectedCreds || email !== expectedCreds.email || password !== expectedCreds.password) {
                    errorDiv.textContent = 'Invalid email or password. Please try again.';
                    errorDiv.classList.remove('d-none');
                } else {
                    if (role === 'ngo') {
                        // Correct redirection for the new NGO dashboard design
                        window.location.href = 'ngo-dashboard.html';
                    } else if (role === 'donor') {
                        window.location.href = 'donor-dashboard.html';
                    } else if (role === 'volunteer') {
                        window.location.href = 'volunteer-dashboard.html';
                    } 
                    else if (role === 'admin') {
                        // NEW REDIRECTION FOR ADMIN
                        window.location.href = 'admin-dashboard.html';
                    }
                    else {
                        alert(`Login successful as ${role}! Redirecting...`);
                        window.location.href = 'index.html'; 
                    }
                }
            } else {
                alert(`Sign up successful for ${email} as a ${role}! Redirecting...`);
                window.location.href = 'index.html';
            }
        });
    }

    /**
     * Initializes functionality for ALL portal pages (New NGO, Donor, Volunteer).
     */
 /**
 * Initializes functionality for ALL portal pages (New NGO, Donor, Volunteer).
 */
function initPortalPages() {
    // --- Logic for the new NGO Portal Universal Modal ---
    const modalPlaceholder = document.getElementById('modal-placeholder');
    if (modalPlaceholder) {
        fetch('_modal.html')
            .then(response => {
                if (!response.ok) throw new Error('Could not find _modal.html');
                return response.text();
            })
            .then(html => {
                modalPlaceholder.innerHTML = html;
                setupNgoCreationModal(); // This function is defined below
            })
            .catch(error => {
                console.error('CRITICAL ERROR: Failed to load _modal.html.', error);
                console.warn('The "Create New..." buttons on NGO pages will not work.');
            });
    }

    // --- Logic for Donor and Volunteer Modals ---
    handleModalForm('#donateModal', '#donation-form', 'Donation was successful! Thank you for your support.');
    handleModalForm('#applyModal', '#apply-form', 'Application submitted successfully!');
}

    /**
     * Sets up the dynamic, universal modal for the new NGO portal pages.
     */
    function setupNgoCreationModal() {
        const creationModalEl = document.getElementById('creationModal');
        if (!creationModalEl) return;

        const creationModal = new bootstrap.Modal(creationModalEl);
        const modalTitle = document.getElementById('modalTitle');
        const modalFieldsContainer = document.getElementById('modal-fields-container');
        const modalSubmitButton = document.getElementById('modalSubmitButton');
        const form = document.getElementById('creation-form');

        const modalFields = {
            Campaign: `
                <div class="mb-3"><label class="form-label">Campaign Title</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" rows="3" required></textarea></div>
                <div class="mb-3"><label class="form-label">Your Name</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Your Email</label><input type="email" class="form-control" required></div>
                <div class="row"><div class="col-md-6 mb-3"><label class="form-label">Date</label><input type="date" class="form-control" required></div><div class="col-md-6 mb-3"><label class="form-label">Time</label><input type="time" class="form-control" required></div></div>
                <div class="mb-3"><label class="form-label">Location</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Upload PDF</label><input type="file" class="form-control" accept=".pdf"></div>
            `,
            Event: `
                <div class="mb-3"><label class="form-label">Event Name</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" rows="3" required></textarea></div>
                <div class="mb-3"><label class="form-label">Your Name</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Your Email</label><input type="email" class="form-control" required></div>
                <div class="row"><div class="col-md-6 mb-3"><label class="form-label">Date</label><input type="date" class="form-control" required></div><div class="col-md-6 mb-3"><label class="form-label">Time</label><input type="time" class="form-control" required></div></div>
                <div class="mb-3"><label class="form-label">Location</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Upload PDF</label><input type="file" class="form-control" accept=".pdf"></div>
            `,
            Story: `
                <div class="mb-3"><label class="form-label">Story Title</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" rows="5" required></textarea></div>
                <div class="mb-3"><label class="form-label">Your Name</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Your Email</label><input type="email" class="form-control" required></div>
                <div class="row"><div class="col-md-6 mb-3"><label class="form-label">Date</label><input type="date" class="form-control" required></div><div class="col-md-6 mb-3"><label class="form-label">Time</label><input type="time" class="form-control" required></div></div>
                <div class="mb-3"><label class="form-label">Location</label><input type="text" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Upload PDF</label><input type="file" class="form-control" accept=".pdf"></div>
            `
        };

        creationModalEl.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const modalType = button.getAttribute('data-modal-type');
            modalTitle.textContent = `Create New ${modalType}`;
            modalFieldsContainer.innerHTML = modalFields[modalType] || '';
            modalSubmitButton.textContent = `Create ${modalType}`;
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            creationModal.hide();
            form.reset();
            form.classList.remove('was-validated');
            showToast('Item created successfully!');
        });
    }
    
    // --- Helper and Public Page Functions (no changes needed) ---
    function initCampaignDetailsPage() {}
    function initTransparencyPage() {}
    function initVolunteerPage() {}
    
    function handleModalForm(modalSelector, formSelector, successMessage) {
        const modalEl = document.querySelector(modalSelector);
        if (!modalEl) return;
        const form = modalEl.querySelector(formSelector);
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            modal.hide();
            form.reset();
            form.classList.remove('was-validated');
            showToast(successMessage);
        });
    }
    
    function showToast(message) {
        const toastEl = document.getElementById('actionSuccessToast');
        const toastBody = document.getElementById('toast-body-message');
        if (!toastEl || !toastBody) return;
        toastBody.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toast.show();
    }

    function animateCounter(element) {
        if (!element || element.hasAttribute('data-counted')) return;
        element.setAttribute('data-counted', 'true');
        const isCurrency = element.textContent.includes('$') || element.textContent.includes('₹');
        const target = parseInt(element.textContent.replace(/[\$,₹+,]/g, ''));
        const currencySymbol = isCurrency ? (element.textContent.includes('₹') ? '₹' : '$') : '';
        let current = 0;
        const duration = 1500, stepTime = 20, steps = duration / stepTime, increment = target / steps;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                element.textContent = currencySymbol + target.toLocaleString();
            } else {
                element.textContent = currencySymbol + Math.ceil(current).toLocaleString();
            }
        }, stepTime);
    }
});