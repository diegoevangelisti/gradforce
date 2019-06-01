var express = require("express");
const router = express.Router();
const User = require("../models/users");
const Mail = require("../models/mails");


router.get("/tables", (req, res) => {

  User.find().then((users) => {
    res.render("../views/admin-panel/tables", {
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
      res.render("../views/admin-panel/accept-email", {
        user: user, type: type
      });
    })
});

module.exports = router;