// Testing booking

async function testBooking() {
    try {
        // 1. Get packages (this will seed the DB and return real ObjectIds)
        const pkgsRes = await fetch('http://localhost:5000/api/packages');
        const packages = await pkgsRes.json();
        console.log(`Fetched ${packages.length} packages`);
        
        if (packages.length === 0) {
            console.log("No packages available");
            return;
        }

        const packageId = packages[0]._id;
        console.log(`Using package ID: ${packageId}`);

        // 2. Register/Login a user to get a token
        const loginRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123' })
        });
        const user = await loginRes.json();
        
        if (!user.token) {
            console.log("Failed to register/login", user);
            return;
        }

        console.log("Successfully logged in");

        // 3. Submit booking
        const bookingRes = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                packageId,
                people: 2,
                date: '2026-05-01',
                contactInfo: {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '1234567890'
                }
            })
        });

        if (bookingRes.ok) {
            const booking = await bookingRes.json();
            console.log("Booking successful!", booking);
        } else {
            const error = await bookingRes.json();
            console.error("Booking failed:", error);
        }

    } catch (e) {
        console.error("Error running test:", e);
    }
}

testBooking();
