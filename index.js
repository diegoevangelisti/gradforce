var express = require("express");
var app = express();
require('dotenv').config()
const passport = require("passport");
//const passportSetup = require("./config/passport-setup");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const cookieSession = require('cookie-session');
var Student = require("./api/models/students");
var LocalStrategy = require("passport-local");
//var PassportLocalMongoose = require("passport-local-mongoose");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const keys = require('./config/keys')
//const cron = require("node-cron");

//
//GOOGLE AUTHn
//

app.use(cookieSession({
  maxAge: 24 * 60 * 10 * 1000,
  keys: ['Frodo from the Shire']

}));

//initialize passport

//Seting Passport for local authentication

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

passport.serializeUser((student, done) => {
  done(null, student.id)

})

passport.serializeUser((id, done) => {
  Student.findById(id).then((student) => {
    done(null, student);
  })
})

//Setting passport for google authentication

passport.use(new GoogleStrategy({
    callbackURL: "/auth/google/redirect",
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecrect

  },
  (accessToken, refreshToken, profile, done) => {
    Student.findOne({
      email: profile.emails[0].value
    }).then((currentStudent) => {
        if (currentStudent) {
          //already have the User
          console.log('User is: ', currentStudent);
          done(null, currentStudent);
        } else {
          //create a new User
          const student = new Student({
            _id: Math.random()
              .toString(36)
              .substr(2, 9),
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            photo: profile.picture,
          })
          student.save().then((newStudent) => {
            console.log('new user created:' + newStudent);
            done(null, newStudent);
          })

        }

      }

    )
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
    Student.findOneAndUpdate(query, {
      photo: profile.photos[0].value,
      facebookId: profile.id
    }).then((currentStudent) => {

      if (currentStudent) {
        //already have the User
        currentStudent.photo = profile.photos[0].value
        console.log('User is: ', currentStudent);
        done(null, currentStudent);

      } else {
        //create a new User
        const student = new Student({
          _id: Math.random()
            .toString(36)
            .substr(2, 9),
          username: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          facebookId: profile.id
        })
        student.save().then((newStudent) => {
          console.log('new user created:' + newStudent);
          done(null, newStudent);
        })
      }
    })
  }));



//for hiding credentials

/*
app.use(require('forest-express-mongoose').init({
  modelsDir: __dirname + '/api/models',
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  mongoose:require('mongoose'),
}));
*/


//ejs view
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/assets'));
//initialize body parser and morgan

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Magic word for passport 

app.use(require("express-session")({
  secret: "My dear Gandalf from The Lord of the Rings",
  resave: false,
  saveUninitialized: false
}));




//
// Routes
//

//var User = require("./api/models/users");

const studentsRoutes = require('./api/routes/students');
const authRoutes = require('./api/routes/auth');
const landingRoutes = require('./api/routes/landing');
const profileRoutes = require('./api/routes/profile');
app.use('/students', studentsRoutes);
app.use('/auth', authRoutes);
app.use('/', landingRoutes);
app.use('/profile', profileRoutes);

app.listen(process.env.PORT || 5000, async function () {
  console.log("listening on port " + (process.env.PORT || 5000));
});


//MLAB HEROKU
mongoose.connect("mongodb://gradforce:gradforce1@ds259586.mlab.com:59586/heroku_844c6wxc", {useNewUrlParser: true})

//MONGO ATLAS DATABASE
// mongoose.connect('mongodb+srv://diego-re:' + process.env.MONGO_ATLAS_PW +
// '@cluster0-y9ijb.mongodb.net/test?retryWrites=true');

//LOCAL HOSTING
//mongoose.connect("mongodb://localhost/gradforce-admin");

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