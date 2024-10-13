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

  query(sql, params, callback) {
    this.db.query(sql, params, callback);
  }
}

module.exports = new Database();
