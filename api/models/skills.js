const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var skillSchema = mongoose.Schema({
    _id: String,
    name: String
});

skillSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Skill', skillSchema);