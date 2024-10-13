const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db'); 

const insertTestRows = (res) => {
    const rows = [
        ['Sara Brown', '1901-01-01'],
        ['John Smith', '1941-01-01'],
        ['Jack Ma', '1961-01-30'],
        ['Elon Musk', '1999-01-01']
    ];
    const query = 'INSERT INTO patient (name, dateOfBirth) VALUES ?';
    db.query(query, [rows], (err) => {
        if (err) {
            res.writeHead(500);
            res.end('Error inserting rows.');
        } else {
            res.writeHead(200);
            res.end('Rows inserted successfully.');
        }
    });
};

// Create HTTP server
http.createServer((req, res) => {
    if (req.method === 'GET') {
        // Serve the index.html file
        if (req.url === '/') {
            fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading index.html');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        }
    } else if (req.method === 'POST') {
        // Handle insert rows request
        if (req.url === '/insert') {
            insertTestRows(res);
        } else if (req.url === '/sql') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); 
            });

            req.on('end', () => {
                const query = JSON.parse(body).query;
                if (/^(INSERT|SELECT)/i.test(query)) {
                    db.query(query, (err, results) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: err.message }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(results));
                        }
                    });
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Only SELECT and INSERT queries are allowed.' }));
                }
            });
        }
    }
}).listen(3000, () => {
    console.log('Server listening on port 3000');
});
