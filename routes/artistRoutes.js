const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { globals } = require('../globals');
const { Artist, Track } = require('../models');

const router = Router();
const baseURL = globals.baseURL;
const dbUpdate = globals.dbUpdate;


router.get('/artists', ensureAuthenticated, async (req, res) => {
  let access= req.session.accessToken;

  const ids = await Track.select_single_col('artist_id');
  const idArray = (Object.values(ids));

  let artists = [];

  if (access) {
    for(let i = 0; i < Math.ceil(idArray.length / 50); i++) {
      let ids = idArray.slice(i * 50, (i + 1) * 50).join(',');

      await fetch(baseURL + 'artists/?ids=' + ids, {
          headers: { 'Authorization': 'Bearer ' + access } })
        .catch((err) => console.log(err))
        .then((res) => res.json())
        .then((json) => json.artists.forEach( a => artists.push({'id': a.id, 'name': a.name, 'genres': a.genres })));
    }

    if (dbUpdate) { 
      try {
          Artist.insert(artists);
      } catch ( error ) {
        console.log(error);
      }
    }
  }

  res.render("artists", { user: req.user, artists: artists });
});

router.get('/playlist/:id', ensureAuthenticated, async (req, res) => {
  // Todo: Include logic to handle failed access token due to expiriation.
  // * Read this: https://developer.spotify.com/documentation/general/guides/authorization-guide/
  let access = req.session.accessToken;
  let playlist;

  await fetch(baseURL + 'playlists/' + req.params.id, {
    headers: { 'Authorization': 'Bearer ' + access }, })
    .then((res) => res.json())
    .then((json) => playlist = json)
    .catch((err) => console.log(err));

  if (playlist.tracks) {
    let tracks = [];
    playlist.tracks.items.forEach((track) => {
      let t = track.track;
      tracks.push({
        'id': t.id,
        'name': t.name,
        'album_id': t.album.id,
        'album_name': t.album.name ,
        'artist_id': t.artists[0].id,
        'artist_name': t.artists[0].name
        });
    });

    res.render('playlist', { user: req.user, name: playlist.name, tracks: tracks });
  } else {
    res.redirect('/playlists');
  }

});

module.exports = router;