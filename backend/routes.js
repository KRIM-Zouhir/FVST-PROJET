// backend/routes.js
const express = require('express');
const router = express.Router();
const Annonce = require('./models/Annonce');

// Route pour récupérer toutes les annonces
router.get('/annonces', (req, res) => {
  Annonce.getAll((err, rows) => {
    if (err) {
      res.status(500).send('Error fetching annonces');
    } else {
      res.json(rows);
    }
  });
});

// Route pour ajouter une annonce
router.post('/annonces', (req, res) => {
  const annonce = req.body;
  Annonce.create(annonce, (err) => {
    if (err) {
      res.status(500).send('Error creating annonce');
    } else {
      res.status(200).send('Annonce created');
    }
  });
});

module.exports = router;
