const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

const { baseURL, dbUpdate } = require('../globals');
const { Playlist, Track } = require('../models');

router.get('/playlist/:id/edit', ensureAuthenticated, async (req, res) => {
    const playlistQuery = await Playlist.select(req.params.id);
    console.log(playlistQuery);
    playlist = playlistQuery.rows[0];
    const trackQuery = await Track.select(playlist.track_ids);
    let tracks = trackQuery.rows;

    res.render('playlistEdit', { user: req.user, name: playlist.name, tracks: tracks });
});

module.exports = router; 