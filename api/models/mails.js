const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var mailSchema = mongoose.Schema({
    _id: String,
    type: String,
    content: String
});

//mailSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Mail', mailSchema);