const nodemailer = require('nodemailer');

let userEmail = 'noreply.masterslease@gmail.com'
let pass = "gvbz uqgj oudq jjot"

async function Sendmail(toEmail, subject, html) {
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

    return mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
            return false
        } else {
            console.log('Email sent successfully');
            return true
        }
    });
}

module.exports = Sendmail
