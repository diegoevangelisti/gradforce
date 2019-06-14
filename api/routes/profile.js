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


//Update Work Experience

router.put("/update-work-experience/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.experienceNumber;

  User.findByIdAndUpdate(id).then((user) => {

    user.work[index].role = req.body.role
    user.work[index].company = req.body.company;
    user.work[index].start_date = req.body.start_year;
    user.work[index].end_date = req.body.end_year;
    user.work[index].description = req.body.work_description;
    user.save()
      .then(user => {
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

//Update About information

router.put("/update-about/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;

  User.findByIdAndUpdate(id).then((user) => {

    user.about = req.body.summary
    user.save()
      .then(user => {
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

//Update Details information

router.put("/update-details/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;

  User.findByIdAndUpdate(id).then((user) => {

    user.fname = req.body.fname,
      user.lname = req.body.lname,
      user.title = req.body.title,
      user.phone_number = req.body.phone

    user.save()
      .then(user => {
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

//Update Education information

router.put("/update-education/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.educationNumber;

  User.findByIdAndUpdate(id).then((user) => {

    user.education[index].course = req.body.course
    user.education[index].educational_provider = req.body.provider
    user.education[index].start_date = req.body.start_year_edu
    user.education[index].end_date = req.body.end_year_edu
    user.education[index].description = req.body.description_edu
    user.save()
      .then(user => {
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

//Update Education information

router.post("/add-education/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;

  let objEducation = {
    course: req.body.course,
    educational_provider: req.body.provider,
    start_date: req.body.start_year_edu,
    end_date: req.body.end_year_edu,
    description: req.body.description_edu
  }

  User.findOneAndUpdate({
      _id: id
    }, {
      $push: {
        education: objEducation
      }
    },
    function (error, user) {
      if (error) {
        console.log(error);
      } else {
        user.save();
        console.log(user);
      }
    });

  res.redirect("/profile");

});


module.exports = router;