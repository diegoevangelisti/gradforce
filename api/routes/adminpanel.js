var express = require("express");
const router = express.Router();
const User = require("../models/users");
const Admin = require("../models/admin");
var passport = require("passport");



function isAdminLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/adminpanel/login");
}

//
//Log in and Log out routes for admin
//

router.post("/login", passport.authenticate("admin", {
  successRedirect: "tables",
  failureRedirect: "login",
}), function (req, res) {
  res.send(admin._id)
  console.log("User: " + req.admin);
});

router.get("/login", (req, res, next) => {
  res.render("../views/admin-panel/login");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/adminpanel/login");
});

//
// Tables routes
//

router.get("/tables", isAdminLoggedIn, (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/tables/tables", {
      users: users
    });
  })
});

router.get("/tables-students", isAdminLoggedIn, (req, res) => {

  User.find().where("userType", "Student").then((users) => {
    res.render("../views/admin-panel/tables/tables-students", {
      users: users
    });
  })
});

router.get("/tables-employers", isAdminLoggedIn, (req, res) => {

  User.find().where("userType", "Employer").then((users) => {
    res.render("../views/admin-panel/tables/tables-employers", {
      users: users
    });
  })
});

router.get("/tables-students-status2", isAdminLoggedIn, (req, res) => {

  User.find().where("status", "Profile Complete").where("userType", "Student").then((users) => {
    res.render("../views/admin-panel/tables/tables-students-status2", {
      users: users
    });
  })
});

router.get("/calendar", isAdminLoggedIn, (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/calendar", {
      users: users
    });
  })
});


router.get("/add-new-user", isAdminLoggedIn, (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/register", {
      users: users
    });
  })
});

router.get("/send-email/:type/:id", isAdminLoggedIn, (req, res) => {

  let type = req.params.type;
  let id = req.params.id;

  User.findById(id)
    .then((user) => {
      console.log(user)
      res.render("../views/admin-panel/send-email", {
        user: user,
        type: type
      });
    })

});

router.get("/userprofile/student/:id", isAdminLoggedIn, (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/profiles/student-profile", {
        user: user
      });
    })
});

router.get("/userprofile/employer/:id", isAdminLoggedIn, (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/profiles/employer-profile", {
        user: user
      });
    })
});

router.get("/userprofile/student/edit/:id", isAdminLoggedIn, (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/profiles/student-profile-edit", {
        user: user
      });
    })
});

router.get("/userprofile/employer/edit/:id", isAdminLoggedIn, (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/profiles/employer-profile-edit", {
        user: user
      });
    })
});

router.post("/userprofile/employer/edit/:id", isAdminLoggedIn, (req, res) => {
  let addressUnit = req.body.addressUnit;
  let addressStreet = req.body.addressStreet;
  let addressCity = req.body.addressCity;
  let addressSuburb = req.body.addressSuburb;
  let description = "";

  switch (req.body.status) {
    case "Profile Incomplete":
      description = "Waiting for Employer";
      break;
    case "Profile Complete":
      description = "Employer ready to hire";
      break;
  }

  let query = {
    _id: req.params.id
  };

  User.findOneAndUpdate(query, {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone_number: req.body.phone_number,
      address: {
        street: addressStreet,
        unit: addressUnit,
        city: addressCity,
        suburb: addressSuburb
      },
      DOB: req.body.dob,
      status: req.body.status,
      description: description
    }, {
      new: true
    })
    .then((user) => {
      res.render("../views/admin-panel/profiles/employer-profile", {
        user: user
      });
    })
});

router.post("/userprofile/student/edit/:id", isAdminLoggedIn, (req, res) => {
  let addressUnit = req.body.addressUnit;
  let addressStreet = req.body.addressStreet;
  let addressCity = req.body.addressCity;
  let addressSuburb = req.body.addressSuburb;
  let description = "";

  switch (req.body.status) {
    case "Profile Incomplete":
      description = "Waiting for Student";
      break;
    case "Profile Complete":
      description = "Interview/Upskilling";
      break;
    case "Interview mail sent":
      description = "Interview in progress";
      break;
    case "Upskilling mail sent":
      description = "Upskilling in progress";
      break;
    case "Interview completed":
      description = "Interview completed";
      break;
    case "Interview with Employer":
      description = "Interview with Employer set";
      break;
    case "Employed":
      description = "Student Employed";
      break;
  }

  let query = {
    _id: req.params.id
  };

  User.findOneAndUpdate(query, {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone_number: req.body.phone_number,
      address: {
        street: addressStreet,
        unit: addressUnit,
        city: addressCity,
        suburb: addressSuburb
      },
      DOB: req.body.dob,
      status: req.body.status,
      description: description
    }, {
      new: true
    })
    .then((user) => {
      res.render("../views/admin-panel/profiles/student-profile", {
        user: user
      });
    })
});

router.get('/deleteuser/:id', isAdminLoggedIn, (req, res) => {
  let id = req.params.id;
  User.find({
      _id: id
    })
    .remove()
    .exec()
    .then(result => {
      console.log(result);
      res.redirect("/adminpanel/tables");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
})

module.exports = router;