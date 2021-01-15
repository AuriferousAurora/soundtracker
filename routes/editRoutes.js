const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

const { baseURL, dbUpdate } = require('../globals');
const { Playlist, Track } = require('../models');

router.get('/playlist/:id/edit', ensureAuthenticated, async (req, res) => {
    res.send('Editing playlist: ' + req.params.id);
});

module.exports = router;