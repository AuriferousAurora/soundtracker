const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { globals } = require('../globals');
const { Artist, Track } = require('../models');

const router = Router();
const baseURL = globals.baseURL;
const dbUpdate = globals.dbUpdate;

router.get('/tracks', ensureAuthenticated, async (req, res) => {
    let access = req.session.accessToken;

    let limit = 50;
    let next = '';
    let total = 0;

    let tracks = [];

    if (access) {
      await fetch(baseURL + 'me/tracks?limit=' + limit, {
          headers: { 'Authorization': 'Bearer ' + access } })
        .catch((err) => console.log(err))
        .then((res) => res.json())
        .then((json) =>  {
          total = json.total;
          next = json.next;

          json.items.forEach(item => tracks.push(item));
      });

      while (tracks.length < total) {
        await fetch(next, {
            headers: { 'Authorization': 'Bearer ' + access } })
          .catch((err) => console.log(err))
          .then((res) => res.json())
          .then((json) =>  {
            next = json.next;
            json.items.forEach(item => tracks.push(item));
        });
      }
    }

    function unpackTrackData(tracks) {
      let r = [];

      tracks.forEach( t => {
        r.push({ 'id': t.track.id, 
                 'name': t.track.name,
                 'artist_id': t.track.artists[0].id,
                 'artist_name': t.track.artists[0].name,
                 'album_id': t.track.album.id,
                 'album_name': t.track.album.name });
      });

      return r;
    }

    if (dbUpdate) {
      try {
        const t = unpackTrackData(tracks);
        Track.insert(t);
      } catch (error) {
        console.log(error);
      }
    }


    res.render("tracks", { user: req.user, tracks: tracks }); 
});

router.get("/track/:id", ensureAuthenticated, async (req, res) => { 

  let access = req.session.accessToken;
  let track;

  await fetch(baseURL + 'tracks/' + req.params.id, {
    headers: { 'Authorization': 'Bearer ' + access }, })
    .then((res) => res.json())
    .then((json) => track = json)
    .catch((err) => console.log(err));

  res.render("track", { track: track }); 

});

module.exports = router;