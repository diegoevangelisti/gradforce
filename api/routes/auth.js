const express = require("express");
const session = require('express-session');
const router = express.Router();
var app = express();
const User = require("../models/users");
var passport = require("passport");


//cookie session timelapse

app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  }
}))

//
//Local registration routes
//
router.get("/register/usertype", (req, res, next) => {

  req.session.userType = req.query.userType;
  console.log("QUERY: " + req.query.userType);
  console.log("Session user type: " + req.session.userType);
  console.log("Session id: " + req.session.id);

  res.end('done');

});

router.get("/register", (req, res) => {
  res.render("../views/index");
});

router.post("/register", (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((currentUser) => {

    if (currentUser) {
      //already have the User
      console.log('Already exists: User is: ', currentUser);
      res.redirect("login");
    } else {
      User.register(new User({
          _id: Math.random()
            .toString(36)
            .substr(2, 9),
          userType: req.body.userType,
          fname: req.body.fName,
          lname: req.body.lName,
          email: req.body.email,
          phone_number: req.body.phone,
          username: req.body.email,
          status: "profile incomplete"
        }),
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            console.log("User not added, please check the form");
            return res.render("../views/auth/register");

          }
          res.redirect("login");
        });
    }
  })

});

//
//User register by admin
//

router.post("/register-by-admin", (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((currentUser) => {

    if (currentUser) {
      //already have the User
      console.log('Already exists: User is: ', currentUser);
      res.redirect("../adminpanel/tables");
    } else {
      User.register(new User({
          _id: Math.random()
            .toString(36)
            .substr(2, 9),
          userType: req.body.userType,
          fname: req.body.fName,
          lname: req.body.lName,
          email: req.body.email,
          phone_number: req.body.phone,
          username: req.body.email,
          status: "profile incomplete"
        }),
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            console.log("User not added, please check the form");
            return res.render("../views/admin-panel/tables");

          }
          res.redirect("../adminpanel/tables");
        });
    }
  })

});
//
//Login routes
//

router.post("/login", passport.authenticate("local", {
  successRedirect: "../profile",
  failureRedirect: "login",
}), function (req, res) {
  res.send(user._id)
  console.log("User: " + req.user);
});

router.get("/login", (req, res, next) => {
  res.render("../views/login");
});


//
//Google register/login routes
//

router.get('/google',
  passport.authenticate('google', {

    scope: ['profile', 'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

router.get('/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {

    console.log("USER TYPE: " + req.session.userType);
    console.log("Session id checking: " + req.session.id);
    console.log("Username:" + req.session.passport.user);

    //Find the user and update it with the usertype 

    User.findOne({
      username: req.session.passport.user
    }, function (err, doc) {
      if (!doc.userType) {
        doc.userType = req.session.userType;
        doc.save();
      }
    });

    // Successful authentication
    res.redirect("/profile");
  });

//
//Facebook register/login routes
//

router.get('/facebook', passport.authenticate('facebook'));


router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    console.log("USER TYPE: " + req.session.userType);
    console.log("Session id checking: " + req.session.id);
    console.log("Username:" + req.session.passport.user);

    //Find the user and update it with the usertype 

    User.findOne({
      username: req.session.passport.user
    }, function (err, doc) {
      if (!doc.userType) {
        doc.userType = req.session.userType;
        doc.save();
      }
    });
    // Successful authentication
    res.redirect("/profile");
  });

//
//Logout routes
//

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;