const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var jobPostSchema = mongoose.Schema({
    _id: String,
    company_id: String,
    title: String,
    description: String,
    type: String
});

jobPostSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('JobPost', jobPostSchema);