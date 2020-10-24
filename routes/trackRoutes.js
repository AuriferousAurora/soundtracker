const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get("/track/:id", ensureAuthenticated, (req, res) => { res.render("track"); });

module.exports = router;