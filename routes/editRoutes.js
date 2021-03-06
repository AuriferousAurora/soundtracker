const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

const { baseURL, dbUpdate } = require('../globals');
const { Playlist, Track, Genre } = require('../models');

router.get('/playlist/:id/edit', ensureAuthenticated, async (req, res) => {
    const playlistQuery = await Playlist.select(req.params.id);
    const playlist = playlistQuery.rows[0];
    const trackQuery = await Track.select(playlist.track_ids);
    const tracks = trackQuery.rows;

    res.render('playlistEdit', { user: req.user, name: playlist.name, tracks: tracks });
});

router.get('/playlist/new', ensureAuthenticated, async (req, res) => {
    const genreQuery = await Genre.all();
    const genres = genreQuery.rows;
    
    res.render('playlistCreate', { user: req.user, genres: genres });
});

router.post('/playlist/new', ensureAuthenticated, async (req, res) => {
    const genreID = req.body.genre_id;
    const genreName = await Genre.select(genreID);
    console.log(genreName);
    
    res.render('playlistCreate', { user: req.user });
});


module.exports = router; 