const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // FIX 1: Clean up any broken tailwind configs completely.
    content = content.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/g, '');
    
    // Inject the correct tailwind config right before </head>
    const correctTailwind = `
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#0F172A',
                        secondary: '#0EA5E9',
                        accent: '#F59E0B'
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>`;
    
    content = content.replace('</head>', correctTailwind);

    // FIX 2: Ensure Currency and Dark Mode are in nav only ONCE
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

    // FIX 3: Update Footer
    const footerRegex = /<p>&copy; 2026 Voyago\. All rights reserved\.<\/p>/;
    if (content.match(footerRegex)) {
        const newFooter = `<div class="flex flex-col md:items-end text-sm text-gray-400 mt-4 md:mt-0 gap-1">
                    <p>&copy; 2026 Voyago Travel Agency Ltd. | VAT: PK-12948573</p>
                    <p>123 Horizon Blvd, Tech District, Islamabad, Pakistan</p>
                </div>`;
        content = content.replace(footerRegex, newFooter);
    }

    // FIX 4: Clean up excessive dark mode classes on body
    content = content.replace(/dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 /g, '');
    if (!content.includes('dark:bg-gray-900')) {
        content = content.replace(/<body class="([^"]+)">/, '<body class="$1 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">');
    }
    
    // FIX 5: Profile specific fixes
    if (f === 'profile.html') {
        if (!content.includes('Print E-Ticket')) {
            content = content.replace(
                '<div class="text-right">\n                                    <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span>\n                                </div>',
                `<div class="text-right flex flex-col gap-2 items-end">
                                    <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span>
                                    <button onclick="window.print()" class="text-sm text-secondary hover:text-blue-700 font-medium flex items-center gap-1 print:hidden">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                        Print E-Ticket
                                    </button>
                                </div>`
            );
        }
        
        if (!content.includes('@media print')) {
            content = content.replace(
                '</style>',
                `        @media print {
            .glass-nav, footer, .analytics-card, #user-wishlist, h2 { display: none !important; }
            body { background: white; color: black; }
            .bg-white { box-shadow: none !important; border: 2px solid #ccc; break-inside: avoid; margin-bottom: 20px; }
            .print\\:hidden { display: none !important; }
        }\n    </style>`
            );
        }
    }

    fs.writeFileSync(f, content);
});

console.log('All files deeply repaired!');
