const express = require('express');
const session = require("express-session");
const passport = require('passport');
const consolidate = require('consolidate');
const fetch = require('node-fetch');

const SpotifyStrategy = require('passport-spotify').Strategy;

const { globals } = require('./globals');
const { ensureAuthenticated } = require('./middleware/authMiddleware');

require('dotenv').config();

const mainRoutes = require('./routes/mainRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const port = globals.port || 3000;
const authCallbackPath = globals.authCallbackPath;
const baseURL = globals.baseURL || 'https://api.spotify.com/v1/';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and spotify profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:' + port + authCallbackPath,
    passReqToCallback: true
    },
    function (req, accessToken, refreshToken, expires_in, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(async function() {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
            req.session.accessToken = accessToken;
            done(null, profile);
        });
    })
);

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "html");

app.use( session({ secret: "keyboard cat", resave: true, saveUninitialized: true }) );

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

app.engine("html", consolidate.nunjucks);

app.use(mainRoutes);
app.use(playlistRoutes);

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
    "/auth/spotify",
    passport.authenticate("spotify", {
        scope: ["user-read-email", "user-read-private"],
        showDialog: true,
    })
);

// Todo: Rewrite home route to reroute to login if not logged in and create separate 'playlists' route.
// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
    authCallbackPath,
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/home");
    }
);




app.listen(port, () => { return 'Application is listening on port ' + port; });