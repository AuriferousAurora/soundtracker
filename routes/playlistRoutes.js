const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get('/playlist/:id', ensureAuthenticated, (req, res) => {
  console.log('Fetch requsest received. Playlist ID ' + req.params.id + ' requested.');
  res.send('Playlist with ID: ' + req.params.id);
})

module.exports = router;