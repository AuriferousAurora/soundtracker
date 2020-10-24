const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { globals } = require('../globals');

const router = Router();
const baseURL = globals.baseURL;

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