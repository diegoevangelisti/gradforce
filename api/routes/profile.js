var express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("../views/profile", {user: req.user});
    console.log("User: "+req.user)
  });
module.exports = router;