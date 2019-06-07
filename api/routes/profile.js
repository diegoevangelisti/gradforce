var express = require("express");
const router = express.Router();

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("./auth/login");
}

router.get("/", isLoggedIn, (req, res) => {
    res.render("../views/studentprofile", {user: req.user, isLoggedIn: true});
    console.log("User: "+req.user)
  });
module.exports = router;