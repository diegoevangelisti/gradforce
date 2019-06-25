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
var methodOverride = require('method-override');
var flash = require("connect-flash");


app.use(cookieParser());



const keys = require('./config/keys')
var User = require("./api/models/users");
var Admin = require("./api/models/admin");

app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(methodOverride("_method"));

//
// Redirect to Register page
//

app.get('/', (req, res) => {

  res.redirect("/auth/register");

})

//
//Serialize - deserialize two different models
//User and Admin
//

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

passport.serializeUser(function (userObject, done) {
  let userGroup = "model1";
  let userPrototype = Object.getPrototypeOf(userObject);

  if (userPrototype === User.prototype) {
    userGroup = "model1";
  } else if (userPrototype === Admin.prototype) {
    userGroup = "model2";
  }

  let sessionConstructor = new SessionConstructor(userObject._id, userGroup, '');
  done(null, sessionConstructor);
});
passport.deserializeUser(function (sessionConstructor, done) {

  if (sessionConstructor.userGroup == 'model1') {
    User.findOne({
      _id: sessionConstructor.userId
    }, '-localStrategy.password', function (err, user) {
      done(err, user);
    });
  } else if (sessionConstructor.userGroup == 'model2') {
    Admin.findOne({
      _id: sessionConstructor.userId
    }, '-localStrategy.password', function (err, user) {
      done(err, user);
    });
  }
});


//
//Magic word for passport 
//

app.use(require("express-session")({
  secret: "que te cuento?",
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


app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash("message");
  next();
});

//
//GOOGLE AUTH
//

//Register / Login with Google

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
          //Create a new User
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
            status: "Profile Incomplete",
            dates: {
              created: new Date().toLocaleString()
            }
          })
          user.save().then((newUser) => {
            console.log('new user created:' + newUser);
            done(null, newUser);
          })
          res.redirect("/profile");
        }
      })
  }));

//
//FACEBOOK AUTH
//

//Register / Login with Google

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

          //Create a new User
          const user = new User({
            _id: Math.random()
              .toString(36)
              .substr(2, 9),
            username: profile.emails[0].value,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            facebookId: profile.id,
            status: "Profile Incomplete",
            //description: description,
            dates: {
              created: new Date().toLocaleString()
            }
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
app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));

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
mongoose.connect("mongodb://backend:" + process.env.MLAB_PASSWORD + "@ds259596.mlab.com:59596/heroku_xk93l586", {
  useNewUrlParser: true
});

//LOCAL HOSTING
/*mongoose.connect("mongodb://localhost/gradforce-local", {
  useNewUrlParser: true,
  useFindAndModify: false
});
*/
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