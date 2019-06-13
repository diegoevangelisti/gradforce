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
    DOB: String,
    email: String,
    photo: String,
    phone_number: Number,
    title: String,
    status: String,
    description: String,
    about: String,
    dates: {
        created: Date,
        updated: Date,
        lastMailSent: Date
    },
    address: {
        street: String,
        unit: String,
        city: String,
        suburb: String
    },
    education: [{
        course: String,
        educational_provider: String,
        start_date: String,
        end_date: String,
        description: String
        
    }],
    work: [{
        company: String,
        city: String,
        country: String,
        role: String,
        start_date: String,
        end_date: String,
        description: String
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