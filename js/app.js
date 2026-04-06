document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const path = window.location.pathname;
    
    if (path.includes('packages.html')) {
        initPackagesPage();
    } else if (path.includes('booking.html')) {
        initBookingPage();
    } else if (path.includes('admin.html')) {
        initAdminPage();
    } else {
        // index.html or default
        initHomePage();
    }
});

// Mock fetch from local packages data
// Using fetch allows local testing IF served via http. 
// We add a fallback to allow simple 'file://' loading just in case CORS fails.
let _cachedPackages = null;
const fallbackPackages = [
    {
        "id": "pkg-01",
        "name": "Santorini Sunset Retreat",
        "description": "Experience the famous white architecture and breathtaking sunsets of Santorini. Includes luxury accommodation, daily breakfast, and a private sunset yacht tour.",
        "price": 1290,
        "image": "./images/santorini.jpg"
    },
    {
        "id": "pkg-02",
        "name": "Bali Tropical Escape",
        "description": "Discover the exotic beauty of Bali. Includes stay at a jungle resort in Ubud, cultural templar visits, and exclusive access to a beach club.",
        "price": 950,
        "image": "./images/bali.jpg"
    },
    {
        "id": "pkg-03",
        "name": "Swiss Alps Adventure",
        "description": "A thrilling escape to the Swiss Alps. Enjoy premium skiing resorts, hot springs, and a scenic ride on the Glacier Express.",
        "price": 1850,
        "image": "./images/swiss.jpg"
    },
    {
        "id": "pkg-04",
        "name": "Tokyo Neon Nights",
        "description": "Immerse yourself in the vibrant culture of Tokyo. Features guided culinary tours, a visit to Mt. Fuji, and a stay in a luxury high-rise.",
        "price": 1450,
        "image": "./images/tokyo.jpg"
    },
    {
        "id": "pkg-05",
        "name": "Maldives Overwater Bliss",
        "description": "The ultimate relaxation in the Maldives. Includes an overwater bungalow, unlimited scuba diving sessions, and an underwater restaurant dinner.",
        "price": 2500,
        "image": "./images/maldives.jpg"
    }
];

// --- Currency Conversion Logic ---
// 1 USD = 280 PKR
const EXCHANGE_RATE_USD_TO_PKR = 280;

function formatPricePKR(priceUSD) {
    const pricePKR = priceUSD * EXCHANGE_RATE_USD_TO_PKR;
    // Format to local string and prefix with PKR, e.g., PKR 420,000
    return `PKR ${pricePKR.toLocaleString('en-US')}`;
}

async function fetchPackages() {
    if (_cachedPackages) return _cachedPackages;

    try {
        const response = await fetch('data/packages.json');
        if (!response.ok) throw new Error("Network issue");
        _cachedPackages = await response.json();
    } catch (error) {
        console.warn("Could not fetch packages.json via fetch API (maybe CORS from file://?). using fallback data.");
        _cachedPackages = fallbackPackages;
    }
    return _cachedPackages;
}

// ---------------------------
// HOME PAGE LOGIC
// ---------------------------
async function initHomePage() {
    const featuredContainer = document.getElementById('featured-packages');
    if (!featuredContainer) return;
    
    // Show loading
    featuredContainer.innerHTML = '<div class="loading">Loading amazing destinations...</div>';

    // Simulate network delay for effect
    setTimeout(async () => {
        const packages = await fetchPackages();
        featuredContainer.innerHTML = '';
        
        // Take first 3 for featured
        const featured = packages.slice(0, 3);
        
        featured.forEach(pkg => {
            featuredContainer.appendChild(createPackageCard(pkg));
        });
    }, 500);
}

// ---------------------------
// PACKAGES PAGE LOGIC
// ---------------------------
async function initPackagesPage() {
    const gridContainer = document.getElementById('packages-grid');
    const searchInput = document.getElementById('search-pkg');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '<div class="loading">Loading amazing destinations...</div>';

    setTimeout(async () => {
        const packages = await fetchPackages();
        renderPackages(packages, gridContainer);

        // Search feature
        if(searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = packages.filter(pkg => 
                    pkg.name.toLowerCase().includes(term) || 
                    pkg.description.toLowerCase().includes(term)
                );
                renderPackages(filtered, gridContainer);
            });
        }
    }, 500);
}

function renderPackages(packages, container) {
    container.innerHTML = '';
    if (packages.length === 0) {
        container.innerHTML = '<div class="empty-state">No packages found matching your search.</div>';
        return;
    }
    packages.forEach(pkg => {
        container.appendChild(createPackageCard(pkg));
    });
}

function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-img-wrapper">
            <span class="price-tag">${formatPricePKR(pkg.price)}</span>
            <!-- Image fixing logic: Use relative path, but if image is missing, fallback to Unsplash online image URL -->
            <img src="${pkg.image}" alt="${pkg.name}" class="card-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop';">
        </div>
        <div class="card-body">
            <h3 class="card-title">${pkg.name}</h3>
            <p class="card-desc">${pkg.description}</p>
            <a href="booking.html?pkg=${pkg.id}" class="btn btn-primary" style="text-align: center;">Book Now</a>
        </div>
    `;
    return card;
}

// ---------------------------
// BOOKING PAGE LOGIC
// ---------------------------
async function initBookingPage() {
    const form = document.getElementById('booking-form');
    const packageSelect = document.getElementById('package-select');
    const successMsg = document.getElementById('success-message');
    
    if (!form || !packageSelect) return;

    // Load available packages into dropdown
    const packages = await fetchPackages();
    packages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.name; // Keep it simple by storing name
        option.textContent = `${pkg.name} - ${formatPricePKR(pkg.price)}`;
        packageSelect.appendChild(option);
    });

    // Auto select package if URL parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const pkgId = urlParams.get('pkg');
    if (pkgId) {
        const selectedPkg = packages.find(p => p.id === pkgId);
        if (selectedPkg) {
            packageSelect.value = selectedPkg.name;
        }
    }

    // Form Submittion
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic Required Validation
        if (!form.checkValidity()) {
            alert("Please fill in all required fields.");
            return;
        }

        // Specific Format Validation (e.g. Email & Phone)
        const emailInput = document.getElementById('email').value;
        const phoneInput = document.getElementById('phone').value;
        
        if (!emailInput.includes('@') || !emailInput.includes('.')) {
            alert("Validation Error: Please enter a correct email format.");
            return;
        }
        
        // Ensure phone is numeric
        if (!/^[0-9+\-\s]+$/.test(phoneInput)) {
            alert("Validation Error: Phone number must be numeric.");
            return;
        }
        
        // Create booking object
        const newBooking = {
            id: Date.now().toString(), // unique id
            name: document.getElementById('fname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            package: document.getElementById('package-select').value,
            people: document.getElementById('people').value,
            date: document.getElementById('date').value,
            createdAt: new Date().toISOString()
        };

        // localStorage Fallback Check
        if (typeof window.localStorage === 'undefined') {
            alert("Browser Error: Local Storage is not supported or enabled.");
            return;
        }

        try {
            // Get existing reservations from localStorage (simulating backend data retrieval)
            // Use key: "bookings" to store all bookings
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            
            // Add new booking to our array of objects
            bookings.push(newBooking);
            
            // Save all booking info back to localStorage (Persistent across browser reloads)
            localStorage.setItem('bookings', JSON.stringify(bookings));
        } catch (e) {
            console.error("Error saving booking data", e);
            alert("Failed to save booking data due to browser storage limits.");
            return;
        }

        // Show Success message and Clear the form after submission
        successMsg.style.display = 'block';
        form.reset();
        
        // Scroll to top to see error/success state
        window.scrollTo(0, 0);
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    });
}

// ---------------------------
// ADMIN PAGE LOGIC
// ---------------------------
function initAdminPage() {
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    renderAdminTable();
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    const tableContainer = document.getElementById('table-container');
    const emptyState = document.getElementById('admin-empty-state');
    
    // Load all bookings from localStorage using key "bookings"
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    if (bookings.length === 0) {
        tableContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.package}</td>
            <td>${booking.date}</td>
            <td>${booking.people}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteBooking('${booking.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Global function to attach to inline onclick
window.deleteBooking = window.deleteBooking || function(id) {
    if (confirm("Are you sure you want to delete this booking?")) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        renderAdminTable();
    }
};
