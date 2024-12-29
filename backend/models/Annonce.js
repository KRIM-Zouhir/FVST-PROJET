// backend/models/Annonce.js
const db = require('../database');

class Annonce {
  static create(annonce, callback) {
    const query = 'INSERT INTO annonces (depart, arrivee, date, produits, prix) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [annonce.depart, annonce.arrivee, annonce.date, annonce.produits, annonce.prix], callback);
  }

  static getAll(callback) {
    const query = 'SELECT * FROM annonces';
    db.all(query, [], callback);
  }
}

module.exports = Annonce;
