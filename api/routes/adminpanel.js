var express = require("express");
const router = express.Router();
const User = require("../models/users");


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

  User.find().then((users) => {
    res.render("../views/admin-panel/emails", {
      users: users
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

router.get("/accept-email/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render("../views/admin-panel/accept-email", {
        user: user
      });
    })
});

module.exports = router;