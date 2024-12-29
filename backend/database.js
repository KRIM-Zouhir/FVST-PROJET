// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./livraison.db', (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Database connected.");
  }
});

module.exports = db;
