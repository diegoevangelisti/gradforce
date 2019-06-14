const express = require("express");
const session = require('express-session');
const router = express.Router();
const User = require("../models/users");
const Mail = require("../models/mails");
var passport = require("passport");
const nodemailer = require("nodemailer");
const keys = require('../../config/keys')


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
"use strict";


router.post("/send-email/:id", (req, res) => {


    let subject = req.body.subject;
    let content = req.body.content;
    let email = req.body.email;
    let type = req.body.type;
    let id = req.params.id;

    User.findById(id).then((user) => {

            //change status and description of user
            //according to admin's decision

            if (type == "interview") {

                user.status = "Interview mail sent";
                user.description = "Interview in process";
                user.save();

            } else if (type == "upskilling") {

                user.status = "Upskilling mail sent";
                user.description = "Upskilling in process";
                user.save();

            }

            //send mail to user

            async function main() {

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // use SSL
                    auth: {
                        user: 'gradforce.co.nz@gmail.com',
                        pass: process.env.GMAIL
                    }
                });

                let info = await transporter.sendMail({
                    from: '"GradForce" <gradforce.co.nz@gmail.com>',
                    to: email,
                    subject: subject,
                    text: content,
                });

                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }

            main().catch(console.error);
            res.redirect("/adminpanel/tables");
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


});

module.exports = router;