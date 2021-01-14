const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { globals } = require('../globals');
const { Artist, Track, Genre } = require('../models');

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
          // ! This code needs to be turned into model or middleware code.
          // let genreNames = [];
          // artists.forEach(a => genreNames.push(a['genres']));
          // let dedupedGenres = Array.from(new Set(genreNames.reduce((a, c) => a.concat(c))));
          // Genre.insert(dedupedGenres);
          // * This can probably stay.
          // Artist.insert(artists);
      } catch ( error ) {
        console.log(error);
      }
    }
  }

  res.render("artists", { user: req.user, artists: artists });
});

module.exports = router;