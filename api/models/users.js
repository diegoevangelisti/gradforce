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
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    fname: String,
    lname: String,
    companyName: String,
    webSite: String,
    DOB: String,
    email: {
        type: String,
        unique: true,
        require: true
    },
    img: {
        data: Buffer,
        contentType: String
    },
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
    education_status: String,
    education: [{
        education_type: String,
        course: String,
        educational_provider: String,
        country: String,
        start_date: String,
        end_date: String
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
    role: [{
        title: String,
        description: String,
        skills: [String]
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