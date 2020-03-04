const router = require('express').Router();
const db = require('../database/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const credentials = req.body;

  db('users')
    .where('username', credentials.username)
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        const payload = {
          subject: user.id,
          username: user.username,
          department: user.department
        };
        const options = {
          expiresIn: '1h'
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, options)

        res.status(200).json({ message: 'welcome', token: token })
      }
      else {
        res.status(400).json({ message: "invalid password" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Uh oh, theres something gone wrong!" })
    })
});

module.exports = router;
