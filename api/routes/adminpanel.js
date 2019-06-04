var express = require("express");
const router = express.Router();
const User = require("../models/users");
const Mail = require("../models/mails");


router.get("/tables", (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/tables/tables", {
      users: users
    });
  })
});

router.get("/tables-students", (req, res) => {

  User.find().where("userType", "Student").then((users) => {
    res.render("../views/admin-panel/tables/tables-students", {
      users: users
    });
  })
});

router.get("/tables-employers", (req, res) => {

  User.find().where("userType", "Employer").then((users) => {
    res.render("../views/admin-panel/tables/tables-employers", {
      users: users
    });
  })
});

router.get("/tables-students-status2", (req, res) => {

  User.find().where("status", "Profile Complete").where("userType", "Student").then((users) => {
    res.render("../views/admin-panel/tables/tables-students-status2", {
      users: users
    });
  })
});

router.get("/calendar", (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/calendar", {
      users: users
    });
  })
});

router.get("/email-template", (req, res) => {

  Mail.find().then((mails) => {
    res.render("../views/admin-panel/emails", {
      mails: mails
    });
  })
});


router.get("/add-new-user", (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/register", {
      users: users
    });
  })
});

router.get("/accept-email/:id/:type", (req, res) => {
  let id = req.params.id;
  let type = req.params.type;
  User.findById(id)
    .then((user) => {
      Mail.find().where("type", type).then((mail) => {
        res.render("../views/admin-panel/accept-email", {
          user: user, type: type, mail: mail
        });

      })
     
    })
});

router.get("/userprofile/student/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/profiles/student-profile", {
        user: user
      });
    })
});

router.get("/userprofile/employer/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/profiles/employer-profile", {
        user: user
      });
    })
});


module.exports = router;