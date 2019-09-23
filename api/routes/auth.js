const express = require("express");
const session = require('express-session');
const router = express.Router();
var app = express();
const User = require("../models/users");
const Admin = require("../models/admin");
var passport = require("passport");

//for forget password
const nodemailer = require("nodemailer");
var crypto = require("crypto");
var async = require("async");


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
  var passedVariable = req.query.message;
  if (req.user) {
    res.render("../views/index", {
      user: req.user,
      message: passedVariable,
      isLoggedIn: true,
      SignUp: "No"
    })
  } else {
    res.render("../views/index", {
      message: passedVariable,
      isLoggedIn: null,
      SignUp: "Yes"
    })
  }
});

router.post("/register", (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((currentUser) => {

    if (currentUser) {
      //The user exists
      var message = "Email already register. Please try another one";
      res.redirect("register/?message=" + message);
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
          photo: "/assets/img/profile-placeholder.jpg",
          description: description,
          dates: {
            created: new Date().toLocaleString()
          }
        }),
        req.body.password,

        function (err, user) {
          if (err) {
            res.redirect('/login');
          } else {
            passport.authenticate('local')(req, res, function () {
              res.redirect('/profile');

              //send welcome email
              //DISABLE - 
              var enableWelcomeEmail = false;

              if (enableWelcomeEmail) {

                var subject = "Welcome to GradForce";
                var content = "Hi " + user.fname + ",\n\n" + "Welcome to GradForce! You've taken the first step, now is time to start filling in your profile.\n\n" +
                  "This are the suggested steps to follow:\n\n" + "1. Complete your personal details. Don't forget to give us your cell phone number!\n" +
                  "2. Write a sort sentence about your and select your main Skills. That's great to start knowing you a little bit more\n" +
                  "3. Education section: All terciary level. Give as a brief resume of your educational records here\n" +
                  "4. Work Experience: Very important! Start from the most recient one and just focus on the most significant ones\n\n" +
                  "And then wait for our answer. We'll try to contact you as soon as possible, the idea is to have a meeting to get you know better\n" +
                  "\nDon't hesitate in drop as a comment in case you need some help\n\n" +
                  "All the Best!\n\n" +
                  "GradForce Team";

                async function main() {

                  var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // use SSL
                    auth: {
                      user: 'gradforce.co.nz@gmail.com',
                      pass: process.env.GMAIL
                    }
                  });

                  let info = await transporter.sendMail({
                    from: '"GradForce" <gradforce.co.nz@gmail.com>',
                    to: user.email,
                    subject: subject,
                    text: content,
                  });
                  console.log("Message sent: %s", info.messageId);
                  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                }

                main().catch(console.error);
              }
            })
          }
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
          photo: "/assets/img/profile-placeholder.jpg",
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
      res.redirect("/profile");
    });
    // Successful authentication
  });

//
// Forget password
//

router.get("/forgetpassword", (req, res) => {

  if (req.query.message) {
    var message = req.query.message;
    var failure = null;

  } else if (req.query.failure) {
    var failure = req.query.failure;
    var message = null;
  }
  res.render("../views/forgetpassword", {
    message: message,
    failure: failure,
    isLoggedIn: null,
    SignUp: null
  });
})

router.post('/forgetpassword', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (!user) {
          var failure = "The email doesn't exist. Please try again";
          return res.redirect('/auth/forgetpassword/?failure=' + failure);
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: 'gradforce.co.nz@gmail.com',
          pass: process.env.GMAIL
        }
      });
      var mailOptions = {
        to: user.email,
        from: '"GradForce" <gradforce.co.nz@gmail.com>',
        subject: 'GradForce Password Reset',
        text: 'Hi ' + user.email + ', \n\n' + 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
          'Thanks, \n' +
          'GradForce Team'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    var message = "We sent you an email with the instructions";
    res.redirect('/auth/forgetpassword/?message=' + message);
  });
});

//Reset password

router.get('/reset/:token', function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      //passwords do not match
    }
    res.render("../views/reset", {
      failure: req.flash("failure"),
      token: req.params.token,
      isLoggedIn: null,
      SignUp: null
    });
  });
});

router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!user) {
          req.flash("failure", "Token expired. Come back to Forget Password");
          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              });
            });
          })
        } else {
          //passwords do not match
          req.flash("failure", "The passwords do not match. Try again");
          return res.redirect('back');
        }
      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: 'gradforce.co.nz@gmail.com',
          pass: process.env.GMAIL
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gradforce.co.nz@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hi there,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n' +
          'Thanks, \n' +
          'GradForce Team'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/profile');
  });
});

//
//Login routes
//

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      var message = encodeURIComponent('Wrong Email or Password. Please try again');
      return res.redirect("login/?message=" + message);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('../profile');
    });
  })(req, res, next);
});

router.get("/login", (req, res, next) => {

  var passedVariable = req.query.message;
  console.log("THIS: " + passedVariable)
  res.render("../views/login", {
    message: passedVariable,
    isLoggedIn: null,
    SignUp: null,
  });
});

//
//Logout routes
//

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/auth/register");
});

module.exports = router;