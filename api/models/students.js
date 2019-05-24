const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Crete mongoose schema
var studentSchema = mongoose.Schema({
    _id: String,
    googleId: String,
    facebookId: String,
    username: String,
    password: String,
    fname: String,
    lname: String,
    DOB: Date,
    companyName: String,
    email: String,
    photo: String,
    phoneNumber: Number,
    address: { 
        street: String,
        unit: String,
        city: String,
        suburb: String
    },
    education: {
        educationStatus: String,
        educationalProvider: String,
        startDate: Date,
        endDate: Date,
        course: String
    },
    work: [{
        company: String,
        country: String,
        role: String,
        startDate: Date,
        endDate: Date
    }],
    bookingDate: Date,
    ranking: Number,
    Skills: {
        softs: [String],
        technicalSkills: [String]
    }
});

studentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Student', studentSchema);