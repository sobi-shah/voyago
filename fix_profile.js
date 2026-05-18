const fs = require('fs');
let content = fs.readFileSync('profile.html', 'utf8');

content = content.replace(
    '<div class="text-right">\\n                                    <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span>\\n                                </div>',
    '<div class="text-right">\\n                                    <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span>\\n                                </div>'
);

// Actually regex is safer
content = content.replace(/<div class="text-right">\s*<span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Confirmed<\/span>\s*<\/div>/, `<div class="text-right flex flex-col gap-2 items-end">
                                    <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span>
                                    <button onclick="window.print()" class="text-sm text-secondary hover:text-blue-700 font-medium flex items-center gap-1 print:hidden">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                        Print E-Ticket
                                    </button>
                                </div>`);

fs.writeFileSync('profile.html', content);
