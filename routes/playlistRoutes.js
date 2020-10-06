const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { globals } = require('../globals');

const router = Router();
const baseURL = globals.baseURL;

router.get('/playlist/:id', ensureAuthenticated, async (req, res) => {
  // Todo: Include logic to handle failed access token due to expiriation.
  let access = req.session.accessToken;
  let playlist;

  await fetch(baseURL + 'playlists/' + req.params.id, {
    headers: { 'Authorization': 'Bearer ' + access }, })
    .then((res) => res.json())
    .then((json) => playlist = json.tracks)
    .catch((err) => console.log(err));

  if (playlist) {
    let tracks = [];
    playlist.items.forEach((track) => {
      console.log(track);
      let t = track.track;
      tracks.push({
        'id': t.album.id,
        'name': t.album.name });
    });

    res.render('playlist', { tracks: tracks });
  } else {
    res.redirect('/playlists');
  }

});

module.exports = router;