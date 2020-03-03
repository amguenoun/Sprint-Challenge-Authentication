const router = require('express').Router();
const db = require('../database/dbConfig');
const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  const credentials = req.body;
  const passHash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = passHash;

  db('users')
    .insert(credentials)
    .then(userId => {
      res.status(201).json({ id: userId[0] })
    })
    .catch(err => {
      res.status(500).json({ message: "Uh oh, theres something gone wrong!" })
    })
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
