const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var userSchema = mongoose.Schema({
    _id: String,
    googleId: String,
    facebookId: String,
    userType: String,
    username: String,
    password: String,
    fname: String,
    lname: String,
    DOB: Date,
    email: String,
    photo: String,
    phone_number: Number,
    address: { 
        street: String,
        unit: String,
        city: String,
        suburb: String
    },
    education: {
        education_status: String,
        educational_provider: String,
        start_date: Date,
        end_date: Date,
        course: String
    },
    work: [{
        company: String,
        country: String,
        role: String,
        start_date: Date,
        end_date: Date
    }],
    booking_date: Date,
    ranking: Number,
    Skills: {
        softs: [String],
        skills: [String]
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);