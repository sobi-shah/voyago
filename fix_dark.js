const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // Fix booking.html specific CSS
    if (content.includes('.form-control {')) {
        content = content.replace(
            /@apply block w-full pl-3 pr-3 py-3 mt-1 border border-gray-200 rounded-lg leading-5 bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all;/,
            '@apply block w-full pl-3 pr-3 py-3 mt-1 border border-gray-200 rounded-lg leading-5 bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-700;'
        );
        content = content.replace(
            /@apply block text-sm font-medium text-gray-700;/,
            '@apply block text-sm font-medium text-gray-700 dark:text-gray-300;'
        );
    }

    // Fix inline inputs (login, register, contact)
    content = content.replace(/bg-gray-50(?!.*dark:bg-gray-800)/g, 'bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700');
    
    // Fix cards/containers
    content = content.replace(/bg-white(?!.*dark:bg-gray-800)(?!.*\/80)(?!.*\/90)/g, 'bg-white dark:bg-gray-800');
    
    // Fix text colors
    content = content.replace(/text-gray-800(?!.*dark:text-gray-100)/g, 'text-gray-800 dark:text-gray-100');
    content = content.replace(/text-gray-900(?!.*dark:text-gray-100)/g, 'text-gray-900 dark:text-gray-100');
    content = content.replace(/text-gray-700(?!.*dark:text-gray-300)/g, 'text-gray-700 dark:text-gray-300');

    fs.writeFileSync(f, content);
});

console.log('Dark mode text/input contrast fixed');
