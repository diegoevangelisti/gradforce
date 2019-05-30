//External dependencies

var express = require("express");
var app = express();
require('dotenv').config()
const passport = require("passport");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require("passport-local");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');

app.use(cookieParser());

const keys = require('./config/keys')
var User = require("./api/models/users");

app.set('view engine', 'ejs');
app.use(express.static("views"));


//Magic word for passport 

app.use(require("express-session")({
  secret: "My dear Gandalf from The Lord of the Rings",
  resave: false,
  saveUninitialized: false
}));


//Seting Passport for authentication

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//
//GOOGLE AUTH
//

//Setting passport for google authentication

passport.use(new GoogleStrategy({
    callbackURL: "/auth/google/redirect",
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecrect

  },
  (accessToken, refreshToken, profile, done) => {

    var query = {
      email: profile.emails[0].value
    };
    User.findOneAndUpdate(query, {
        photo: profile.photos[0].value,
        googleId: profile.id
      })
      .then((currentUser) => {

        if (currentUser) {
          //already have the User
          console.log('User is: ', currentUser);
          done(null, currentUser);

        } else {
          //create a new User
          const user = new User({
            _id: Math.random()
              .toString(36)
              .substr(2, 9),
            username: profile.emails[0].value,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            email: profile.emails[0].value,
            photo: profile.picture,
            googleId: profile.id
          })
          user.save().then((newUser) => {
            console.log('new user created:' + newUser);
            done(null, newUser);
          })
          res.redirect("/profile");
        }
      })
  }));

//facebook authentication

passport.use(new FacebookStrategy({
    clientID: keys.facebook.APP_ID,
    clientSecret: keys.facebook.APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'picture.type(large)', 'name', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {

    var query = {
      email: profile.emails[0].value
    };
    User.findOneAndUpdate(query, {
        photo: profile.photos[0].value,
        facebookId: profile.id
      })
      .then((currentUser) => {

        if (currentUser) {
          //already have the User
          console.log('User is: ', currentUser);
          done(null, currentUser);

        } else {
          //create a new User
          const user = new User({
            _id: Math.random()
              .toString(36)
              .substr(2, 9),
            username: profile.emails[0].value,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            facebookId: profile.id
          })
          user.save().then((newStudent) => {
            console.log('new user created:' + newStudent);
            done(null, newStudent);
          })
        }
      })
  }));


//initialize body parser and morgan

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//
// Routes
//
const authRoutes = require('./api/routes/auth');
const profileRoutes = require('./api/routes/profile');
const usersRoutes = require('./api/routes/users');

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.listen(process.env.PORT || 5000, async function () {
  console.log("listening on port " + (process.env.PORT || 5000));
});

//MLAB HEROKU
//mongoose.connect("mongodb://backend:backend1234@ds259596.mlab.com:59596/heroku_xk93l586", {useNewUrlParser: true})

//LOCAL HOSTING
mongoose.connect("mongodb://localhost/gradforce-local", {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);

});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;