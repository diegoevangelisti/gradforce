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
var Admin = require("./api/models/admin");

app.set('view engine', 'ejs');
app.use(express.static("views"));


//
// Redirect to Register page
//

app.get('/', (req,res) => {

  res.redirect("/auth/register");

})


//Google People API


const fs = require('fs');
const readline = require('readline');
const {
  google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Tasks API.
  authorize(JSON.parse(content), listConnectionNames);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listConnectionNames(auth) {
  const service = google.people({
    version: 'v1',
    auth
  });
  service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const connections = res.data.connections;
    if (connections) {
      console.log('Connections:');
      connections.forEach((person) => {
        if (person.names && person.names.length > 0) {
          console.log(person.names[0].displayName);
        } else {
          console.log('No display name found for connection.');
        }
      });
    } else {
      console.log('No connections found.');
    }
  });
}

//Google People ends

//Magic word for passport 

app.use(require("express-session")({
  secret: "My dear Gandalf from The Lord of the Rings",
  resave: false,
  saveUninitialized: false
}));


//Seting Passport for authentication

app.use(passport.initialize());
app.use(passport.session());

passport.use("local", new LocalStrategy({
  usernameField: 'email'
}, User.authenticate()));


 passport.use("admin", new LocalStrategy({
   usernameField: 'email'
 }, Admin.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//
//GOOGLE AUTH
//

//Setting passport for google authentication

passport.use(new GoogleStrategy({
    callbackURL: "https://gradforce-backend.herokuapp.com/auth/google/redirect",
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
            googleId: profile.id,
            status: "Profile Incomplete"
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
            //    photo: profile.photos[0].value,
            facebookId: profile.id,
            status: "Profile Incomplete"
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

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

//
// Routes
//
const authRoutes = require('./api/routes/auth');
const profileRoutes = require('./api/routes/profile');
const adminpanelRoutes = require('./api/routes/adminpanel');
const mailRoutes = require('./api/routes/mail');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/adminpanel', adminpanelRoutes);
app.use('/mail', mailRoutes);

app.listen(process.env.PORT || 5000, async function () {
  console.log("listening on port " + (process.env.PORT || 5000));
});

//MLAB HEROKU
//mongoose.connect("mongodb://backend:"+process.env.MLAB_PASSWORD+"@ds259596.mlab.com:59596/heroku_xk93l586", {useNewUrlParser: true})

//LOCAL HOSTING
 mongoose.connect("mongodb://localhost/gradforce-local", {
   useNewUrlParser: true,
   useFindAndModify: false
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