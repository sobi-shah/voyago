const https = require('https');
const fs = require('fs');

https.get('https://voyago-ha7qnxbi7-sohaibi2175-9072s-projects.vercel.app/api/packages', (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('api_response.txt', `Status: ${res.statusCode}\n\n${data}`);
    });
}).on('error', err => {
    fs.writeFileSync('api_response.txt', `Error: ${err.message}`);
});
