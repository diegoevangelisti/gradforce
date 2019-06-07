const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var adminSchema = mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    fname: String,
    lname: String,
    email: String
});

adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Admin', adminSchema);