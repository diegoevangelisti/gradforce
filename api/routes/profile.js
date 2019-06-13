var express = require("express");
const router = express.Router();
const User = require("../models/users");


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("./auth/login");
}

//Get Student's profile

router.get("/", isLoggedIn, (req, res) => {
  res.render("../views/studentprofile", {
    user: req.user,
    isLoggedIn: true
  });
  console.log("User: " + req.user)
});


//Update user information

router.put("/update/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.experienceNumber;

  User.findByIdAndUpdate(id).then((user) => {

    user.work[index].role = req.body.role
    user.work[index].company = req.body.company;
    user.work[index].start_date = req.body.start_year;
    user.work[index].end_date = req.body.end_year;
    user.work[index].description = req.body.work_description;
    user.save()
      .then(result => {
        console.log(user);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  })
  res.redirect("/profile");

});

module.exports = router;