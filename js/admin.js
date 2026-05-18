document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
});

const API_BASE_URL = '/api';

const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container') || document.createElement('div');
    if (!document.getElementById('toast-container')) {
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-3 flex items-center gap-2`;
    toast.innerHTML = `<span class="font-medium">${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Global State
let adminToken = '';

async function initAdminDashboard() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    // Strict Auth Check
    if (!userInfo || userInfo.role !== 'admin') {
        window.location.href = 'login.html?redirect=admin.html';
        return;
    }

    adminToken = userInfo.token;

    // Initialize Navigation Listeners
    setupNavigation();
    
    // Initialize Package Form Listener
    setupPackageForm();

    // Fetch Initial Data
    await fetchDashboardData();
    await fetchAndRenderPackages();
}

function setupNavigation() {
    const navDashboard = document.getElementById('nav-dashboard');
    const navPackages = document.getElementById('nav-packages');
    
    const viewDashboard = document.getElementById('dashboard-view');
    const viewPackages = document.getElementById('packages-view');

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        navDashboard.classList.replace('text-gray-600', 'text-secondary');
        navDashboard.classList.replace('hover:bg-gray-50', 'bg-blue-50');
        
        navPackages.classList.replace('text-secondary', 'text-gray-600');
        navPackages.classList.replace('bg-blue-50', 'hover:bg-gray-50');

        viewDashboard.classList.remove('hidden');
        viewPackages.classList.add('hidden');
    });

    navPackages.addEventListener('click', (e) => {
        e.preventDefault();
        navPackages.classList.replace('text-gray-600', 'text-secondary');
        navPackages.classList.replace('hover:bg-gray-50', 'bg-blue-50');
        
        navDashboard.classList.replace('text-secondary', 'text-gray-600');
        navDashboard.classList.replace('bg-blue-50', 'hover:bg-gray-50');

        viewPackages.classList.remove('hidden');
        viewDashboard.classList.add('hidden');
    });
}

// ---------------- DASHBOARD LOGIC ----------------

async function fetchDashboardData() {
    try {
        // Fetch Users count
        const usersRes = await fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (usersRes.ok) {
            const users = await usersRes.json();
            document.getElementById('stat-users').textContent = users.length;
        }

        // Fetch Bookings & Revenue
        await fetchAndRenderBookings();
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

async function fetchAndRenderBookings() {
    const tbody = document.getElementById('admin-table-body');
    const emptyState = document.getElementById('admin-empty-state');
    const tableContainer = document.getElementById('table-container');
    const bookingsStat = document.getElementById('stat-bookings');
    const revenueStat = document.getElementById('stat-revenue');

    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE_URL}/bookings`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!res.ok) throw new Error('Failed to fetch bookings');

        const bookings = await res.json();
        
        // Calculate dynamic stats
        let totalRevenue = 0;
        bookings.forEach(b => {
            if (b.package && b.people) {
                totalRevenue += (b.package.price * b.people);
            }
        });

        if (bookingsStat) bookingsStat.textContent = bookings.length;
        if (revenueStat) revenueStat.textContent = `Rs ${totalRevenue.toLocaleString('en-PK')}`;

        if (bookings.length === 0) {
            tableContainer.style.display = 'none';
            emptyState.classList.remove('hidden');
            return;
        }

        tableContainer.style.display = 'block';
        emptyState.classList.add('hidden');
        tbody.innerHTML = '';

        bookings.forEach(booking => {
            const dateStr = new Date(booking.date).toLocaleDateString();
            const pkgName = booking.package ? booking.package.name : 'Unknown Package';
            const userName = booking.contactInfo ? booking.contactInfo.name : (booking.user ? booking.user.name : 'Unknown User');
            const email = booking.contactInfo ? booking.contactInfo.email : '';
            
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">${booking._id.substring(0, 8)}...</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${userName}</div>
                    <div class="text-sm text-gray-500">${email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${pkgName}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${dateStr}</div>
                    <div class="text-xs text-gray-500">${booking.people} Guest(s)</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="deleteBooking('${booking._id}')" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showToast('Error loading bookings', 'error');
        console.error(error);
    }
}

window.deleteBooking = async function(id) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!res.ok) throw new Error('Failed to delete booking');
        
        showToast('Booking deleted successfully');
        fetchDashboardData();
    } catch (error) {
        showToast('Error deleting booking', 'error');
        console.error(error);
    }
};

// ---------------- PACKAGES LOGIC ----------------

async function fetchAndRenderPackages() {
    const tbody = document.getElementById('admin-packages-body');
    const emptyState = document.getElementById('packages-empty-state');
    const tableContainer = document.getElementById('packages-table-container');

    try {
        const res = await fetch(`${API_BASE_URL}/packages`);
        if (!res.ok) throw new Error('Failed to fetch packages');

        const packages = await res.json();

        if (packages.length === 0) {
            tableContainer.style.display = 'none';
            emptyState.classList.remove('hidden');
            return;
        }

        tableContainer.style.display = 'block';
        emptyState.classList.add('hidden');
        tbody.innerHTML = '';

        packages.forEach(pkg => {
            const tr = document.createElement('tr');
            tr.className = 'bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-lg object-cover" src="${pkg.image || 'https://via.placeholder.com/40'}" alt="">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${pkg.name}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${pkg.location || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs ${pkg.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pkg.duration || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick='editPackage(${JSON.stringify(pkg).replace(/'/g, "&apos;")})' class="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors mr-2">Edit</button>
                    <button onclick="deletePackage('${pkg._id}')" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showToast('Error loading packages', 'error');
        console.error(error);
    }
}

// Global modal functions
window.openPackageModal = function() {
    document.getElementById('package-form').reset();
    document.getElementById('pkg-id').value = '';
    document.getElementById('modal-title').textContent = 'Add Package';
    const modal = document.getElementById('package-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closePackageModal = function() {
    const modal = document.getElementById('package-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.editPackage = function(pkg) {
    document.getElementById('pkg-id').value = pkg._id;
    document.getElementById('pkg-name').value = pkg.name;
    document.getElementById('pkg-location').value = pkg.location || '';
    document.getElementById('pkg-price').value = pkg.price;
    document.getElementById('pkg-duration').value = pkg.duration || '';
    document.getElementById('pkg-image').value = pkg.image || '';
    document.getElementById('pkg-description').value = pkg.description || '';
    
    document.getElementById('modal-title').textContent = 'Edit Package';
    const modal = document.getElementById('package-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.deletePackage = async function(id) {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!res.ok) throw new Error('Failed to delete package');
        
        showToast('Package deleted successfully');
        fetchAndRenderPackages();
    } catch (error) {
        showToast('Error deleting package', 'error');
        console.error(error);
    }
};

function setupPackageForm() {
    const form = document.getElementById('package-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('pkg-id').value;
        
        const pkgData = {
            name: document.getElementById('pkg-name').value,
            location: document.getElementById('pkg-location').value,
            price: Number(document.getElementById('pkg-price').value),
            duration: document.getElementById('pkg-duration').value,
            image: document.getElementById('pkg-image').value,
            description: document.getElementById('pkg-description').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/packages/${id}` : `${API_BASE_URL}/packages`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(pkgData)
            });

            if (!res.ok) throw new Error(id ? 'Failed to update package' : 'Failed to create package');
            
            showToast(id ? 'Package updated successfully' : 'Package created successfully');
            closePackageModal();
            fetchAndRenderPackages();
        } catch (error) {
            showToast(error.message, 'error');
            console.error(error);
        }
    });
}
