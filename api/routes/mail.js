const express = require("express");
const session = require('express-session');
const router = express.Router();
const User = require("../models/users");
var passport = require("passport");
const nodemailer = require("nodemailer");
const keys = require('../../config/keys')


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
"use strict";


router.post("/:id", (req, res) => {
    
    
    let subject = req.body.subject;
    let content = req.body.content;
    let email = req.body.email;

    let id = req.params.id;
    User.findById(id).then((user) => {

        
        async function main() {

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'gradforce.co.nz@gmail.com',
                    pass: keys.gmail.GRADFORCE
                }
            });
    
            let info = await transporter.sendMail({
                from: '"GradForce" <gradforce.co.nz@gmail.com>', 
                to: email, 
                subject: subject, 
                text: content, 
               // html: "<b>Hello world?</b>" // html body
            });
    
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    
        main().catch(console.error);
        res.redirect("../adminpanel/tables");
    })
})

module.exports = router;