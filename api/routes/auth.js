const express = require("express");
const session = require('express-session');
const router = express.Router();
var app = express();
const User = require("../models/users");
const Admin = require("../models/admin");
var passport = require("passport");


//cookie session timelapse

app.use(session({
  secret: 'Nothing else matters',
  cookie: {
    maxAge: 300
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
  res.render("../views/index", {
    isLoggedIn: null
  })
});

router.post("/register", (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((currentUser) => {

    if (currentUser) {
      //The user exists
      console.log('Already exists: User is: ', currentUser);
      res.redirect("login");
    } else {
      let description = "";
      switch (req.body.userType) {

        case "Student":
          description = "Waiting for Student";
          break;
        case "Employer":
          description = "Waiting for Employer";
          break;
      }
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
          status: "Profile Incomplete",
          description: description,
          dates: {
            created: new Date().toLocaleString()
          }
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
      let description = "";
      switch (req.body.userType) {

        case "Student":
          description = "Waiting for Student";
          break;
        case "Employer":
          description = "Waiting for Employer";
          break;
      }
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
          status: "Profile Incomplete",
          description: description,
          dates: {
            created: new Date().toLocaleString()
          }
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

//Register an Admin

router.post("/new-admin", (req, res) => {
  Admin.register(new Admin({
      _id: Math.random()
        .toString(36)
        .substr(2, 9),
      username: req.body.email,
      email: req.body.email,
    }),
    req.body.password,
    function (err) {
      if (err) {
        console.log(err);
        res.status(500).json({
          error: err
        });
      } else {
        res.status(201).json({
          message: "Admin added successfully",
        });
      }
    });
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
  res.render("../views/login", {
    isLoggedIn: null
  });
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
    console.log("Username:" + req.user.username);

    //Find the user and update it with the usertype 

    User.findOne({
      username: req.user.username
    }, function (err, doc) {
      if (!doc.userType) {
        console.log("NEW USER TYPE: " + req.session.userType);
        doc.userType = req.session.userType;
        let description = "";
        switch (doc.userType) {
          case "Student":
            description = "Waiting for Student";
            break;
          case "Employer":
            description = "Waiting for Employer";
            break;

        }
        doc.description = description;
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
    console.log("Username:" + req.user.username);

    //Find the user and update it with the usertype 

    User.findOne({
      username: req.user.username
    }, function (err, doc) {
      if (!doc.userType) {
        console.log("NEW USER TYPE: " + req.session.userType);
        doc.userType = req.session.userType;
        let description = "";
        switch (doc.userType) {
          case "Student":
            description = "Waiting for Student";
            break;
          case "Employer":
            description = "Waiting for Employer";
            break;
        }
        doc.description = description;
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
  res.redirect("/auth/register");
});

module.exports = router;