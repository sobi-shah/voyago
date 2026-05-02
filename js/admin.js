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

async function initAdminDashboard() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    // TEMPORARY: Bypassing auth check for screenshot purposes
    // if (!userInfo || userInfo.role !== 'admin') {
    //     window.location.href = 'index.html';
    //     return;
    // }

    await fetchAndRenderBookings(userInfo ? userInfo.token : 'dummy-token');
    // In a real app we'd fetch actual users and revenue, but let's mock stats for now
    document.getElementById('stat-users').textContent = '248';
    document.getElementById('stat-revenue').textContent = 'Rs 12,450';
}

async function fetchAndRenderBookings(token) {
    const tbody = document.getElementById('admin-table-body');
    const emptyState = document.getElementById('admin-empty-state');
    const tableContainer = document.getElementById('table-container');
    const bookingsStat = document.getElementById('stat-bookings');

    if (!tbody) return;

    try {
        // Load bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        if (bookingsStat) bookingsStat.textContent = bookings.length;

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
        showToast('Error loading dashboard data', 'error');
        console.error(error);
    }
}

// Global function for onclick
window.deleteBooking = async function(id) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return;

    try {
        // Remove from localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const updatedBookings = bookings.filter(b => b.id != id);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        showToast('Booking deleted successfully');
        fetchAndRenderBookings(userInfo.token);
    } catch (error) {
        showToast('Error deleting booking', 'error');
    }
};
