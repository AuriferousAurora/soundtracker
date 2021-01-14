const fetch = require('node-fetch');

const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { fetchPlaylistTracks } = require('../middleware/fetchMiddlware');

const { globals } = require('../globals');
const { Playlist } = require('../models');

const router = Router();
const baseURL = globals.baseURL;
const dbUpdate = globals.dbUpdate;

router.get('/playlists', ensureAuthenticated, async (req, res) => {
  let playlists;
  if (dbUpdate) {
    let access = req.session.accessToken;
    if (access) {

      await fetch(baseURL + 'me/playlists', {
        headers: { 'Authorization': 'Bearer ' + access } })
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((json) => playlists = json.items);

      const data = await fetchPlaylistTracks(access, playlists);
      Playlist.insert(data);
    
      res.render("playlists", { user: req.user, playlists: playlists });
    } else {
      res.render("playlists");
    }
  } else {
    let data = await Playlist.all();
    playlists = data.rows;
    res.render("playlists", { user: req.user, playlists: playlists });
  }
});

router.get('/playlist/:id', ensureAuthenticated, async (req, res) => {
  // Todo: Include logic to handle failed access token due to expiriation.
  // * Read this: https://developer.spotify.com/documentation/general/guides/authorization-guide/
  let playlist;
  if (dbUpdate) {
    let access = req.session.accessToken;
    if (access) {
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
      // Todo: Include code to insert tracks into database.
        res.render('playlist', { user: req.user, name: playlist.name, tracks: tracks });
      }
    } else { 
      res.redirect('/playlists');
    }
  } else {
    // Todo: Include code here to grab code from database.
  }    


});

module.exports = router;