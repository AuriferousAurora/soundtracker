const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { Genre } = require('../models');

const router = Router();

router.get("/genres", ensureAuthenticated, async (req, res) => {
    try {
        // Todo: Write code to poll fetch artists and build database out otherwise this code
        // won't work.
        const result = await Genre.all();
        const genres = result.rows;

        res.render("genres", { user: req.user, genres: genres }); 
    } catch(error) {
        res.render("genres", { user: req.user }); 
    }



});

module.exports = router;