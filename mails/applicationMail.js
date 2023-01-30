const Sendmail = require('./sendMail.js')

function applicationMail(toMail, subject) {

    html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8" />
    
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,500;0,700;1,300;1,400;1,500&display=swap"
            rel="stylesheet">
        <title>Masterslease - Apply Online. Quick, Easy</title>
    </head>
    
    <body style="font-family: 'Roboto';">
    
        <div class="resultPage container text-center mx-auto"
            style="width: 80%; margin-right: auto;  margin-left: auto; text-align: center;">
            <h1>YOU <span style="color: #0fe205;">HAVE</span> A <span style="color: #0fe205;">NEW</span> APPLICATION <span
                    style="color: #0fe205;">WAITING<span></h1>
            <p style="text-align: left; margin-top: 50px;">
                Somebody’s picking up what you’re putting down! You’ve received a new application for credit with Masters
                Lease for a new customer who is interested in your products and services!
                <br /><br />
                Please follow this link to access the backend system and review or print the customers application:
                <a target="_blank" href="https://MastersLease.com/employee-login/">Employee Login</a>
                <br /><br />
                Use your credentials to login. If you do not know your credentials or have not been assigned yours, please
                see your immediate supervisor for assistance.
                <br /><br />
                In case of emergency’s please contact David Oliver who can assist with an issues that arise.
                <br /><br />
                Thanks so much! Have a great day!
                <br /><br />
                Received From: NoReply.MastersLease@gmail.com
                <br /><br />
                <br /><br />
                All information included in both internal company documents as well as potential, past and current customers
                information is to only be used internally for this company. This is an official notice to not disclose any
                information about company trade secrets, daily functions, internal programs, software or customer data with
                any unauthorized people.
                <br /><br />
                ©️ Masters Lease 2023 | Dallas, Texas | MastersLease.com
            </p>
        </div>
    
    </body>
    
    </html>`

    Sendmail(toMail, subject, html)
}

module.exports = applicationMail
