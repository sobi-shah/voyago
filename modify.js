const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // 1. Update tailwind.config
    content = content.replace(/tailwind\.config\s*=\s*\{[\s\S]*?theme:\s*\{/, 'tailwind.config = {\n            darkMode: \'class\',\n            theme: {');
    
    // Update colors
    content = content.replace(/primary:\s*'[^']+',/, 'primary: \'#0F172A\',');
    content = content.replace(/secondary:\s*'[^']+',/, 'secondary: \'#0EA5E9\',');
    content = content.replace(/accent:\s*'[^']+'/, 'accent: \'#F59E0B\'');

    // 2. Add Dark mode toggle & Currency to nav
    if (!content.includes('id="theme-toggle"')) {
        const navAuthRegex = /<div id="nav-auth-section" class="flex items-center gap-4 relative z-\[9999\] pointer-events-auto">/;
        if (content.match(navAuthRegex)) {
            const injections = `<div class="flex items-center gap-3 mr-4 border-r border-gray-600 pr-4">
                        <select id="currency-select" class="bg-transparent text-gray-300 hover:text-white text-sm font-medium border-none outline-none cursor-pointer focus:ring-0">
                            <option value="PKR" class="text-black">PKR</option>
                            <option value="USD" class="text-black">USD</option>
                            <option value="EUR" class="text-black">EUR</option>
                            <option value="GBP" class="text-black">GBP</option>
                        </select>
                        <button id="theme-toggle" class="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                            <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                            <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                    `;
            content = content.replace(navAuthRegex, injections + '<div id="nav-auth-section" class="flex items-center gap-4 relative z-[9999] pointer-events-auto">');
        }
    }

    // 3. Update Footer
    const footerRegex = /<p>&copy; 2026 Voyago\. All rights reserved\.<\/p>/;
    if (content.match(footerRegex)) {
        const newFooter = `<div class="flex flex-col md:items-end text-sm text-gray-400 mt-4 md:mt-0 gap-1">
                    <p>&copy; 2026 Voyago Travel Agency Ltd. | VAT: PK-12948573</p>
                    <p>123 Horizon Blvd, Tech District, Islamabad, Pakistan</p>
                </div>`;
        content = content.replace(footerRegex, newFooter);
    }

    // 4. Update body to include dark mode transition
    content = content.replace(/<body class="([^"]+)">/, '<body class="$1 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">');

    fs.writeFileSync(f, content);
});
console.log('HTML files updated successfully.');
