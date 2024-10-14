const http = require('http');
const database = require('./db');

class API {
    constructor() {
        if (!database.checkTableExists()) {
            database.createTable();
        }
    }

    handelRequest(req, res) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        if (req.method == "POST") {
            if (req.url === "/insertTestRows") {
                database.insertTestRows(res);
            } else if (req.url === "/sql") {
                req.on("end", () => {
                    const query = JSON.parse(body).query;
                    if (/^(INSERT)/i.test(query)) {
                        database.query(query, (err, results) => {
                            if (err) {
                                res.writeHead(500, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({ error: err.message }));
                            } else {
                                res.writeHead(200, { "Content-Type": "application/json" });
                                res.end(JSON.stringify(results));
                            }
                        });
                    } else {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Only INSERT queries are allowed in POST requests." }));
                    }
                });
            }
        } else if (req.method === "GET") {
            if (req.url === "/sql") {
                req.on("end", () => {
                    const query = JSON.parse(body).query;
                    if (/^(SELECT)/i.test(query)) {
                        database.query(query, (err, results) => {
                            if (err) {
                                res.writeHead(500, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({ error: err.message }));
                            } else {
                                res.writeHead(200, { "Content-Type": "application/json" });
                                res.end(JSON.stringify(results));
                            }
                        });
                    } else {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Only SELECT queries are allowed in GET requests." }));
                    }
                });
            }
        }
    }

    listen(port = 8080) {
        console.log(`Server is running on port ${port}`);

        http.createServer((req, res) => {
            this.handelRequest(req, res);
        }).listen(port);
    }
}