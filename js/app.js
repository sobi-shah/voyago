document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('package-details')) {
        initPackageDetailsPage();
    } else if (path.includes('packages')) {
        initPackagesPage();
    } else if (path.includes('booking')) {
        initBookingPage();
    } else if (path.includes('admin') || path.includes('login') || path.includes('register') || path.includes('profile')) {
        // Handled by specific scripts
    } else {
        initHomePage();
    }
});

const API_BASE = '/api';

// Utilities
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
};

const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-3 transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-2 z-50`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
        </svg>
        <span class="font-medium">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove after 3s
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Fetch API Wrapper
const fetchPackages = async (queryParams = '') => {
    try {
        const response = await fetch(`/api/packages${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        return data.map(pkg => ({...pkg, id: pkg._id || pkg.id}));
    } catch (error) {
        console.error(error);
        return []; 
    }
};

async function toggleWishlist(packageId, btnElement) {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login to save packages', 'error');
        setTimeout(() => window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href), 1500);
        return;
    }

    try {
        // Optimistic UI update
        const svg = btnElement.querySelector('svg');
        const isHearted = svg.getAttribute('fill') === 'currentColor';
        svg.setAttribute('fill', isHearted ? 'none' : 'currentColor');

        const method = isHearted ? 'DELETE' : 'POST';
        const res = await fetch(`/api/users/wishlist/${packageId}`, {
            method,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to update wishlist');
        showToast(isHearted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
        showToast('Failed to update wishlist', 'error');
        // Revert UI
        const svg = btnElement.querySelector('svg');
        svg.setAttribute('fill', svg.getAttribute('fill') === 'none' ? 'currentColor' : 'none');
    }
}

// Generic Package Card Component
const createPackageCard = (pkg) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover flex flex-col h-full group relative';
    card.setAttribute('data-aos', 'fade-up');
    
    const imgSrc = pkg.image ? pkg.image : `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop`;
    
    // Heart Icon for Wishlist
    const token = localStorage.getItem('token');
    // Ideally we should know if it's already in wishlist, assuming not for simplicity here unless fetched
    const heartIcon = `
        <button onclick="toggleWishlist('${pkg.id}', this)" class="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur p-2 rounded-full text-red-500 hover:bg-white hover:scale-110 transition-all shadow-md">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
    `;

    card.innerHTML = `
        ${heartIcon}
        <div class="relative h-60 overflow-hidden">
            <span class="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary font-bold px-3 py-1 rounded-full text-sm z-10 shadow-sm">${formatCurrency(pkg.price)}</span>
            <img loading="lazy" src="${imgSrc}" alt="${pkg.name}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-white text-sm flex items-center gap-1 font-medium drop-shadow-md">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${pkg.location || 'Global'}
                </span>
            </div>
        </div>
        <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-primary mb-2 font-display">${pkg.name}</h3>
            <p class="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">${pkg.description}</p>
            <a href="package-details.html?id=${pkg.id}" class="w-full inline-block text-center bg-gradient-to-r from-secondary to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 hover:scale-105">View Details</a>
        </div>
    `;
    return card;
};

// ---------------------------
// HOME PAGE LOGIC
// ---------------------------
async function initHomePage() {
    const container = document.getElementById('featured-packages');
    if (!container) return;
    
    // Check if hero search triggered
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if(search) {
        window.location.href = `packages.html?search=${search}`;
        return;
    }

    const packages = await fetchPackages();
    container.innerHTML = '';
    
    if (packages.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">Packages coming soon!</div>';
        return;
    }
    
    packages.slice(0, 3).forEach(pkg => {
        container.appendChild(createPackageCard(pkg));
    });
}

// ---------------------------
// PACKAGES PAGE LOGIC
// ---------------------------
async function initPackagesPage() {
    const container = document.getElementById('packages-grid');
    const searchInput = document.getElementById('search-pkg');
    const locationFilter = document.getElementById('filter-location');
    const priceFilter = document.getElementById('filter-price');
    const applyBtn = document.getElementById('apply-filters');
    
    if (!container) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search');
    if(initialSearch && searchInput) {
        searchInput.value = initialSearch;
    }

    const loadPackages = async () => {
        container.innerHTML = `<div class="col-span-full text-center py-10"><svg class="animate-spin h-8 w-8 text-secondary mx-auto" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`;
        
        const term = searchInput ? searchInput.value : '';
        const loc = locationFilter ? locationFilter.value : '';
        const price = priceFilter ? priceFilter.value : '';

        let query = `?`;
        if (term) query += `search=${term}&`;
        if (loc) query += `location=${loc}&`;
        if (price) {
            const [min, max] = price.split('-');
            if (min) query += `minPrice=${min}&`;
            if (max) query += `maxPrice=${max}&`;
        }

        const packages = await fetchPackages(query);
        
        container.innerHTML = '';
        if (packages.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800">No destinations found</h3>
                    <p class="text-gray-500 mt-2">Try adjusting your search criteria.</p>
                </div>
            `;
            return;
        }
        packages.forEach(pkg => container.appendChild(createPackageCard(pkg)));
    };
    
    // Initial load
    loadPackages();

    if (applyBtn) {
        applyBtn.addEventListener('click', loadPackages);
    }
}

// ---------------------------
// PACKAGE DETAILS PAGE LOGIC
// ---------------------------
async function initPackageDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'packages.html';
        return;
    }

    try {
        const response = await fetch(`/api/packages/${id}`);
        if (!response.ok) throw new Error('Not found');
        const pkg = await response.json();
        pkg.id = pkg._id; // Ensure mapping
        
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('package-content').classList.remove('hidden');
        
        document.getElementById('pkg-title').textContent = pkg.name;
        document.getElementById('pkg-location').textContent = pkg.location || 'Global';
        document.getElementById('pkg-desc').textContent = pkg.description;
        document.getElementById('pkg-price').textContent = formatCurrency(pkg.price);
        document.getElementById('pkg-duration').textContent = pkg.duration || 'N/A';
        document.getElementById('btn-book-now').href = `booking.html?pkg=${pkg.id}`;
        
        const imgEl = document.getElementById('pkg-image');
        imgEl.src = pkg.image ? pkg.image : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop';
        
        const includesList = document.getElementById('pkg-includes');
        if (pkg.includes && pkg.includes.length > 0) {
            pkg.includes.forEach(inc => {
                const li = document.createElement('li');
                li.className = 'flex items-center gap-3 text-gray-700 font-medium';
                li.innerHTML = `<svg class="text-secondary flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${inc}`;
                includesList.appendChild(li);
            });
        } else {
            includesList.innerHTML = '<li class="text-gray-500 italic">Standard inclusions apply.</li>';
        }
    } catch (error) {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
    }
}

// ---------------------------
// BOOKING PAGE LOGIC
// ---------------------------
async function initBookingPage() {
    const form = document.getElementById('booking-form');
    const select = document.getElementById('package-select');
    
    if (!form || !select) return;

    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login to create a booking', 'error');
        setTimeout(() => window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href), 1500);
        return;
    }

    try {
        const userRes = await fetch('/api/users/profile', { headers: { 'Authorization': `Bearer ${token}` }});
        if(userRes.ok) {
            const data = await userRes.json();
            document.getElementById('fname').value = data.user.name;
            document.getElementById('email').value = data.user.email;
        }
    } catch(e) { console.error(e) }

    const packages = await fetchPackages();
    packages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - ${formatCurrency(pkg.price)}`;
        select.appendChild(option);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const pkgId = urlParams.get('pkg');
    if (pkgId) select.value = pkgId;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookingData = {
            packageId: select.value,
            people: parseInt(document.getElementById('people').value),
            date: document.getElementById('date').value,
            contactInfo: {
                name: document.getElementById('fname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: "Not provided" // Using fallback for now, since Zod requires it
            }
        };

        if(!document.getElementById('card-num').value) {
            return showToast('Please enter payment details', 'error');
        }

        try {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';
            btn.disabled = true;

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (res.ok) {
                const successMsg = document.getElementById('success-message');
                successMsg.classList.remove('hidden');
                form.reset();
                showToast('Booking Confirmed!', 'success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                    window.location.href = 'profile.html';
                }, 3000);
            } else {
                const errData = await res.json();
                showToast(errData.message || 'Booking failed', 'error');
            }
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        } catch (error) {
            showToast('Network error', 'error');
            form.querySelector('button[type="submit"]').disabled = false;
        }
    });
}
