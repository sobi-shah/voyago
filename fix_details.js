const fs = require('fs');

let content = fs.readFileSync('package-details.html', 'utf8');

const itinerarySection = `
                    <!-- Interactive Itinerary -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg class="text-secondary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            Interactive Itinerary
                        </h3>
                        <div id="pkg-itinerary" class="space-y-3">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>

                <!-- Right Column (Booking Card) -->
`;

content = content.replace('                </div>\n\n                <!-- Right Column (Booking Card) -->', itinerarySection);

fs.writeFileSync('package-details.html', content);
console.log('package-details.html updated');
