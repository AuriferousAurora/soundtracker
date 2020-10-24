const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get("/", ensureAuthenticated, (req, res) => { res.redirect("login"); });
router.get("/home", ensureAuthenticated, (req, res) => { res.render("home"); });
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

module.exports = router;