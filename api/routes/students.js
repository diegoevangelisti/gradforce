const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../models/students");

router.get("/all", (req, res, next) => {
    Student.find()
        .exec()
        .then(doc => {
            console.log("All categories", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({
                        message: "Error in getting all categories"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});






//POST - Add new student





router.post("/", (req, res, next) => {
    const student = new Student({
            _id: Math.random()
            .toString(36)
            .substr(2, 9),
            username: req.body.username,
            password: req.body.password,
            fname: req.body.fname,
            lname: req.body.lname,
            DOB: req.body.dob,
            email: req.body.email,
            phone_number: req.body.phone_number,
            address: {
                city: req.body.city,
                suburb: req.body.suburb
            },
            education: {
                education_status: req.body.education_status,
                educational_provider: req.body.education_provider,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                course: req.body.course
            },
            work: [{
                company: req.body.company,
                country: req.body.work_country,
                role: req.body.role,
                start_date: req.body.work_start_date,
                end_date: req.body.work_end_date 
            }],
            booking_date: req.body.booking_date,
            ranking: req.body.ranking,
            Skills: {
                softs: [req.body.soft_skills],
                technical: [req.body.technical]
            }
    });
    student
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /students",
                createdStudent: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;