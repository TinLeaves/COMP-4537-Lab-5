// Created in part with GitHub Copilot

const http = require('http');
const database = require('./db');

class API {
    constructor() {
        if (!database.checkTableExists()) {
            database.createTable();
        }
    }

    setCorsHeaders(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    handleRequest(req, res) {
        this.setCorsHeaders(res);

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        //From https://stackoverflow.com/questions/31006711/get-request-body-from-node-jss-http-incomingmessage
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            if (req.method === "POST") {
                if (req.url === "/insertTestRows") {
                    database.insertTestRows(res);
                } else if (req.url === "/sql") {
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
                }
            } else if (req.method === "GET") {
                if (req.url === "/sql") {
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
                }
            } else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Not Found" }));
            }
        });
    }

    listen(port = 8080) {
        console.log(`Server is running on port ${port}`);

        http.createServer((req, res) => {
            this.handleRequest(req, res);
        }).listen(port);
    }
}

const api = new API();
api.listen(8080);