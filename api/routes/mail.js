const express = require("express");
const session = require('express-session');
const router = express.Router();
const User = require("../models/users");
var passport = require("passport");
const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
"use strict";


router.post("/", (req, res) => {
    

    async function main() {

        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'gradforce.co.nz@gmail.com',
                pass: keys.GMAIL_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: '"GradForce" <gradforce.co.nz@gmail.com>', 
            to: "evangelistidiego@gmail.com", 
            subject: "Hello ✔", 
            text: "Hello world?", 
            html: "<b>Hello world?</b>" // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    main().catch(console.error);

})

module.exports = router;