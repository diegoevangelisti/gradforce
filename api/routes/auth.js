const express = require("express");
const router = express.Router();
const Student = require("../models/students");
var passport = require("passport");
const keys = require('../../config/keys');



router.get("/register", (req, res, next) => {
  res.render("../views/index");
});

router.post("/register", (req, res, next) => {

  Student.findOne({
    email: req.body.email
  }).then((currentStudent) => {

    if (currentStudent) {
      //already have the User
      console.log('Already exists: User is: ', currentStudent);
      res.render("../views/index");
    } else {
      Student.register(new Student({
          _id: Math.random()
            .toString(36)
            .substr(2, 9),
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          username: req.body.phone
        }),
        req.body.pass,
        function (err, student) {
          if (err) {
            console.log(err);
            console.log("User not added, please check the form");
            return res.render("../views/index");

          } else {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/profile/");
            });
          }
        });
    }
  })
});


router.get("/login", (req, res, next) => {

  res.render("../views/auth/login");

});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile/",
  failureRedirect: "login"
}), function (req, res) {});

//google login routes

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));

router.get('/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile/');


  });

//facebook login routes
router.get('/facebook',
  passport.authenticate('facebook'));


router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile/');
  });

//logout routes
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;