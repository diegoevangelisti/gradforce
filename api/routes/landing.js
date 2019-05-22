const express = require("express");
const router = express.Router();
const Student = require("../models/students");
var passport = require("passport");


router.get("/", (req, res, next) => {
    res.render("../views/index.ejs");
});


module.exports = router;