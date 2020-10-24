const fetch = require('node-fetch');
const { Router } = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = Router();

router.get("/", ensureAuthenticated, (req, res) => { res.redirect("login"); });
router.get("/home", ensureAuthenticated, (req, res) => { res.render("home"); });

router.get("/login", function (req, res) {
  res.render("login.html", { user: req.user });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

router.get("/account", ensureAuthenticated, function (req, res) {
  res.render("account.html", { user: req.user });
});

module.exports = router;