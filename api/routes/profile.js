var express = require("express");
const router = express.Router();
const User = require("../models/users");
const Skill = require("../models/skills");
var fs = require('fs');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("./auth/login/");
}
//Profile

//Get Student's profile

router.get("/", isLoggedIn, (req, res) => {

  Skill.find().then(skills => {

    //Open Student's profile
    if (req.user.userType == "Student") {
      res.render("../views/studentprofile", {
        skills: skills,
        user: req.user,
        isLoggedIn: true
      });

    } else {

      //Open Employer's profile
      res.render("../views/employerprofile", {
        user: req.user,
        skills: skills,
        isLoggedIn: true
      });
    }
    console.log("User: " + req.user)
  })
});

//Update Work Experience

router.put("/update-work-experience/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.experienceNumber;

  User.findByIdAndUpdate(id).then((user) => {

    user.work[index].role = req.body.role
    user.work[index].company = req.body.company;
    user.work[index].country = req.body.workCountry;
    user.work[index].start_date = req.body.start_year_edit;
    user.work[index].end_date = req.body.end_year_edit;
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
  let sk = req.body.skills;
  console.log(sk);

  User.findByIdAndUpdate(id).then((user) => {

    user.Skills.softs = sk;
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

  console.log("HERE: \n\n\n" + req.body.newPhoto + "\n\n\n")

  User.findByIdAndUpdate(id).then((user) => {


    if (req.body.newPhoto != 0) {
      user.img.data = req.body.newPhoto,
        user.img.contentType = 'image/png'

    }

    console.log("web site: " + req.body.webSite);
    user.webSite = req.body.webSite;
    user.fname = req.body.fname,
      user.lname = req.body.lname,
      user.title = req.body.title,
      user.companyName = req.body.companyName,
      user.phone_number = req.body.phone,


      user.save()
      .then(user => {})
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
    user.education[index].educational_provider = req.body.input_selected_edit_provider
    user.education[index].country = req.body.selected_edit_provider_country
    user.education[index].start_date = req.body.start_year_edu
    user.education[index].end_date = req.body.end_year_edu

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
  });
  res.redirect("/profile");
});

//Delete Education

router.put("/delete-education/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.deleteEducationNumber;

  User.findByIdAndUpdate(id).then((user) => {

    //delete from position index one education record
    user.education.splice(index, 1);

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

//Add Education 

router.post("/add-education/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let current = "Current";
  let previous = "Previous";

  if (!req.body.selected_previous_provider_other_country)
    var previousCountry = "New Zealand";
  else
    var previousCountry = req.body.selected_previous_provider_other_country;

  if (!req.body.selected_current_provide_country)
    var currentCountry = "New Zealand";
  else
    var currentCountry = req.body.selected_current_provider_other_country;


  let currentEducation = {
    education_type: current,
    course: req.body.current_course,
    educational_provider: req.body.selected_current_provider,
    country: currentCountry,
    start_date: req.body.current_start_year,
    end_date: req.body.current_end_year
  }

  let previousEducation = {
    education_type: previous,
    course: req.body.previous_course,
    educational_provider: req.body.selected_previous_provider,
    country: previousCountry,
    start_date: req.body.previous_start_year,
    end_date: req.body.previous_end_year
  }

  //Add education information for Graduate student
  if (req.body.education_status == "Graduate") {

    User.findOneAndUpdate({
        _id: id
      }, {
        $push: {
          education: previousEducation
        },
        $set: {
          education_status: req.body.education_status
        }
      },
      function (error, user) {
        if (error) {
          console.log(error);
        } else {
          user.save();
        }
        res.redirect("/profile");
      });

  } else if (req.body.education_status == "Undergraduate") {

    //Add education information for Undergraduate student
    User.findOneAndUpdate({
        _id: id
      }, {
        $push: {
          education: currentEducation
        },
        $set: {
          education_status: req.body.education_status
        }
      },
      function (error, user) {
        if (error) {
          console.log(error);
        } else {
          user.save();
        }
        res.redirect("/profile");
      });

  } else if (req.body.education_status == "Post-graduate") {

    //Add education information for Post-graduate student
    User.findOneAndUpdate({
        _id: id
      }, {
        $push: {
          education: currentEducation
        },
        $set: {
          education_status: req.body.education_status
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
    User.findOneAndUpdate({
        _id: id
      }, {
        $push: {
          education: previousEducation
        },
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
  }
});

//Add other education 

router.post("/add-other-education/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let previous = "Previous";

  if (!req.body.selected_previous_provider_other_other_country)
    var previousCountry = "New Zealand";
  else
    var previousCountry = req.body.selected_previous_provider_other_other_country;



  let previousEducation = {
    education_type: previous,
    course: req.body.other_previous_course,
    educational_provider: req.body.selected_previous_provider_other_other,
    country: previousCountry,
    start_date: req.body.other_previous_start_year,
    end_date: req.body.other_previous_end_year
  }
  User.findOneAndUpdate({
      _id: id
    }, {
      $push: {
        education: previousEducation
      }
    },
    function (error, user) {
      if (error) {
        console.log(error);
      } else {
        user.save();
      }
      res.redirect("/profile");
    });
});

//Add work experience
router.post("/add-work-experience/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;

  let objExperience = {
    role: req.body.role,
    company: req.body.company,
    country: req.body.workCountryAdd,
    start_date: req.body.start_year,
    end_date: req.body.end_year,
    description: req.body.work_description
  }

  User.findOneAndUpdate({
      _id: id
    }, {
      $push: {
        work: objExperience
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



//Delete Work Experience

router.put("/delete-work-experience/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.deleteExperienceNumber;

  User.findByIdAndUpdate(id).then((user) => {

    //delete from position index one education record
    user.work.splice(index, 1);

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
    res.redirect("/profile");
  })
});


//Add new Role (Employer Profile)

router.post("/add-role/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;

  let objRole = {
    title: req.body.roleTitle,
    description: req.body.roleDescription,
    skills: req.body.roleSkillsAdd


  }

  User.findOneAndUpdate({
      _id: id
    }, {
      $push: {
        role: objRole
      }
    },
    function (error, user) {
      if (error) {
        console.log(error);
      } else {
        user.save();
        console.log(user);
      }
      res.redirect("/profile");
    });
});

//Delete Role
router.put("/delete-role/:id", isLoggedIn, (req, res) => {

  let id = req.params.id;
  let index = req.body.deleteRoleNumber;

  User.findByIdAndUpdate(id).then((user) => {

    //delete from position index one education record
    user.splice(index, 1);

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


module.exports = router;