const mysql = require("mysql2/promise");
require('dotenv').config();

class Database {
  constructor() {
    this.db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log(process.env.DB_HOST);

    // this.connect();
    this.createTable().catch(err => console.error(err)); // Catch errors during table creation
  }

  async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS patient (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        dateOfBirth DATE
      ) ENGINE=InnoDB;
    `;

    try {
      await this.db.execute(createTableQuery);
      console.log('Patient table is ready');
    } catch (err) {
      console.error('Error creating table:', err);
      throw err; 
    }
  }

  async checkTableExists() {
    const query = `SELECT 1 FROM patient LIMIT 1`;

    try {
      await this.db.execute(query);
      return true; 
    } catch (err) {
      return false; 
    }
  }

  async insertTestRows(res) {
    const rows = [
      ["Sara Brown", "1990-01-01"],
      ["John Smith", "1941-01-01"],
      ["Jack Ma", "1961-01-30"],
      ["Elon Musk", "1999-01-01"],
    ];

    const query = `INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)`;

    try {
      await Promise.all(rows.map(row => this.db.execute(query, row)));
      res.writeHead(200);
      res.end('Rows inserted successfully.');
    } catch (err) {
      res.writeHead(500);
      res.end('Error inserting rows: ' + err.message);
    }
  }
}

module.exports = new Database();
