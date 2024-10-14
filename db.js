const mysql = require('mysql');
require('dotenv').config();

class Database {
  constructor() {
    this.db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    this.connect();
    this.createTable();
  }

  connect() {
    this.db.connect((err) => {
      if (err) throw err;
      console.log('Connected to the database');
    });
  }

  createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS patient (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        dateOfBirth DATE
      ) ENGINE=InnoDB;
    `;

    this.db.query(createTableQuery, (err) => {
      if (err) throw err;
      console.log('Patient table is ready');
    });
  }

  checkTableExists() {
    const query = `select 1 from patient LIMIT 1`;

    this.db.query(query, (err) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  }

  insertTestRows(res) {
    const rows = [
      ["Sara Brown", "1990-01-01"],
      ["John Smith", "1941-01-01"],
      ["Jack Ma", "1961-01-30"],
      ["Elon Musk", "1999-01-01"],
    ];

    const query = `INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)`;

    rows.forEach((row) => {
      this.db.query(query, row).then((err) => {
        if (err) {
            res.writeHead(500);
            res.end('Error inserting rows.');
        } else {
            res.writeHead(200);
            res.end('Rows inserted successfully.');
        }
      });
    });
  }

  query(sql, params, callback) {
    this.db.query(sql, params, callback);
  }
}

module.exports = new Database();
