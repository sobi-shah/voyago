const fs = require('fs');

let content = fs.readFileSync('packages.html', 'utf8');

const sortDropdown = `
                    <select id="filter-sort" class="block w-full md:w-48 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                        <option value="">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="duration">Duration (Shortest)</option>
                    </select>
`;

content = content.replace('id="filter-price"', 'id="filter-price" class="block w-full md:w-48 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"');
content = content.replace('id="filter-location"', 'id="filter-location" class="block w-full md:w-48 py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"');

// Insert the sort dropdown before the Filter button
content = content.replace(/<button id="apply-filters"/, sortDropdown + '                    <button id="apply-filters"');

fs.writeFileSync('packages.html', content);
console.log('packages.html fixed');
