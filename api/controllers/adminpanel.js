const User = require("../models/users");
const Admin = require("../models/admin");
const Skill = require("../models/skills");


exports.post_login = (req, res) => {
    res.send(admin._id)
    console.log("User: " + req.admin);
};

exports.get_login = (req, res, next) => {
    res.render("../views/admin-panel/login");
}

