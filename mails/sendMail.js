const nodemailer = require('nodemailer');

let userEmail = 'noreply.masterslease@gmail.com'
let pass = "gvbz uqgj oudq jjot"

function Sendmail(toEmail, subject, html) {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userEmail,
            pass: pass
        }
    });

    let mailDetails = {
        from: userEmail,
        to: toEmail,
        subject: subject,
        html: html
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = Sendmail
