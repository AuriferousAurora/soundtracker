const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

const { baseURL, dbUpdate } = require('../globals');
const { Artist, Genre, Playlist, Track } = require('../models');
const e = require('express');

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
    if (!req.body.completed) {
        const genreID = req.body.genre_id;

        const artistQuery = await Artist.select_by_genre(genreID);
        const artistIDs = artistQuery.rows.map(i => i.id);
        const trackQuery = await Track.select_by_artists(artistIDs);
        const trackIDs = trackQuery.rows.map(i => i.id);

        // Todo: Figure out what I need to do with this next
        let tracks = trackIDs;
        res.status(200).json({ tracks });
    } else {
       console.log('Oops');
    }
});


module.exports = router; 