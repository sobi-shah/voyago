const API_URL = '/api';

// Check if user is logged in
const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

// Update Navbar based on Auth State
const updateNavbar = () => {
    const authSection = document.getElementById('nav-auth-section');
    if (!authSection) return;

    const user = getUserInfo();

    if (user) {
        let adminLink = '';
        if (user.role === 'admin') {
            adminLink = `<a href="admin.html" class="text-secondary font-semibold mr-4">Admin Dashboard</a>`;
        }

        authSection.innerHTML = `
            ${adminLink}
            <div class="flex items-center gap-3">
                <span class="text-gray-300 font-medium">Hi, ${user.name.split(' ')[0]}</span>
                <button id="logout-btn" class="bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm shadow">Logout</button>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', logout);
    }
};

// Register
const register = async (name, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = 'index.html';
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    }
};

// Login
const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = data.role === 'admin' ? 'admin.html' : 'index.html';
        } else {
            showError(data.message || 'Invalid credentials');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    }
};

// Logout
const logout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = 'index.html';
};

// Show Error Helper
const showError = (message) => {
    const errorEl = document.getElementById('error-msg');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => errorEl.classList.add('hidden'), 4000);
    }
};

// Event Listeners for Forms
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                return showError('Passwords do not match');
            }
            register(name, email, password);
        });
    }
});
