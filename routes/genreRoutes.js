const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get("/genres", ensureAuthenticated, (req, res) => { res.render("genres"); });

module.exports = router;