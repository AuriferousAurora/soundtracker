const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { globals } = require('../globals');

const router = Router();
const baseURL = globals.baseURL;

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

    console.log(typeof(tracks));
    console.log(typeof(tracks[0]));
    console.log(tracks[0]);

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