const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var employerSchema = mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    company_name: String,
    address: { 
        street: String,
        unit: String,
        city: String,
        suburb: String
    },
    email: String,
    phone_number: Number
});

employerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Employer', employerSchema);