const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var UserTypeSchema = mongoose.Schema({
    _id: String,
    userType: String
});

UserTypeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('UserType', UserTypeSchema);