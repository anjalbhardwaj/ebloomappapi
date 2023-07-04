const nodemailer = require("nodemailer");
const common = require('../models/common');

exports.sendMails = async (res,sendersEmails) => {
    // const emailsArr = req.body.emails;
    console.log("sendersEmailssendersEmails");
    console.log(sendersEmails);
    const emailsArr = ['nannukuki@gmail.com', 'nannukuki@gmail.com'];
    // Create a transporter object using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
        host: "linux1207.grserver.gr",
        port: "465",
        secure: "tls",
        auth: {
            user: "sales@ebloom.gr",
            pass: "YourEbloom2023!@@@",
        },
    });
    // Define the email options
    sendersEmails.push("sales@ebloom.gr");
    const mailOptions = {
        from: "sales@ebloom.gr",
        to: sendersEmails,
        subject: "Hello from Node.js",
        text: JSON.stringify(res),
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
}

// mailer = require('nodemailer');

// smtpProtocol = mailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: "",
//         pass: ""
//     }
// });

// var mailoption = {
//     from: "",
//     to: "",
//     subject: "Test Mail",
//     html: 'Good Morning!'
// }

// smtpProtocol.sendMail(mailoption, function(err, response){
//     if(err) {
//         console.log(err);
//     } 
//     console.log('Message Sent' + response.message);
//     smtpProtocol.close();
// });

// smtpProtocol = mailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: "sender@gmail.com",
//         pass: "password"
//     }
// });