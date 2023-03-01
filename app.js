const express = require('express')
const cors = require('cors')
const { firebase, db } = require('./config')
const crypto = require('crypto')
const app = express()
const applicationMail = require('./mails/applicationMail')
const otpMail = require('./mails/otpMail')

require('dotenv').config()


// Applications
const Application = db.collection('Application')
const RedFlagged = db.collection('RedFlagged')
const ZipCodes = db.collection('ZipCodes')
const Users = db.collection('Users')
const OTPs = db.collection('OTPs')

app.listen(process.env.PORT, () => console.log("Running"))

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hey Hari Bol !!! It's Working...")
})

// Admin
app.get('/getZipCodes', async (req, res) => {
    const snapshot = await ZipCodes.get();
    let data = snapshot.docs.map(doc => {
        return { id: doc.id, data: doc.data() }
    })
    if (snapshot.empty) {
        res.send({ msg: false })
    } else {
        res.send({ msg: true, data: data })
    }
})

// add zipcodes
app.post('/addZipCodes', async (req, res) => {
    try {
        await ZipCodes.doc(req.body.storeEmail).update({
            "zipcodes": firebase.firestore.FieldValue.arrayUnion(req.body.zipCode)
        })
        res.send({ msg: true })
    } catch (e) {
        await ZipCodes.doc(req.body.storeEmail).set({
            "zipcodes": [req.body.zipCode]
        }).then(val => {
            res.send({ msg: true })
        }).catch(err => {
            console.log(e);
            res.send({ msg: false })
        })

    }
})

// delete zipcodes
app.post('/deleteZipCodes', async (req, res) => {
    try {
        let mail = req.body.storeEmail
        await ZipCodes.doc(mail).update({
            "zipcodes": firebase.firestore.FieldValue.arrayRemove(req.body.zipCode)
        })
        res.send({ msg: true })
    } catch (e) {
        console.log(e);
        res.send({ msg: false })
    }
})

app.get('/getRedFlaggedUsers', async (req, res) => {
    const snapshot = await RedFlagged.get();
    if (snapshot.empty) {
        res.send({ msg: false })
    } else {
        res.send({ msg: true, data: snapshot.docs[0].data() })
    }
})

app.post('/updateRedUsers', async (req, res) => {
    try {
        await RedFlagged.doc("redflagged").set({
            emails: req.body.emails,
            phoneNumbers: req.body.phoneNumbers,
            addresses: req.body.addresses,
        });
        res.send({ msg: true })
    } catch (e) {
        console.log(e);
        res.send({ msg: false })
    }
})

// AddUsers

app.get('/getUsers', async (req, res) => {
    const snapshot = await Users.get();
    if (snapshot.empty) {
        res.send({ msg: false })
    } else {
        res.send({ msg: true, data: snapshot.docs.map(doc => doc.data()) })
    }
})

app.post('/insertUser', async (req, res) => {
    try {
        await Users.doc(req.body.emailAddress).set(req.body)
        res.send({ msg: true })
    } catch (e) {
        console.log(e);
        res.send({ msg: false })
    }
})

app.post('/deleteUser', async (req, res) => {
    try {
        await Users.doc(req.body.emailAddress).delete()
        res.send({ msg: true })
    } catch (e) {
        console.log(e);
        res.send({ msg: false })
    }
})

// Application
app.get('/getApplications', async (req, res) => {
    const snapshot = await Application.get();
    if (snapshot.empty) {
        res.send({ msg: false })
    } else {
        res.send({ msg: true, data: snapshot.docs.map(doc => doc.data()) })
    }
})

app.get('/deleteApplications', async (req, res) => {
    try {
        await Application.doc(req.query.uid).delete()
        res.send({ msg: true })
    } catch (e) {
        console.log(e);
        res.send({ msg: false })
    }
})

/*
    mtv001@masterslease.com    
    mtv002@masterslease.com
    mtv003@masterslease.com 
    mtv004@masterslease.com 
    mtv007@masterslease.com
*/

async function validateZipCodes(zipCode) {
    // Fetch the allowed zipcodes from DB
    const snapshot = await ZipCodes.get();
    if (snapshot.empty) {
        console.log("ZipCodes are empty !!!");
        return false
    } else {
        let matched = false
        let mail = null;
        let docs = snapshot.docs
        for (var j = 0; j < docs.length; j++) {
            const allowedZips = docs[j].data().zipcodes
            for (var i = 0; i < allowedZips.length; i++) {
                if (allowedZips[i] === zipCode.toString()) {
                    mail = docs[j].id
                    matched = true;
                    return { response: matched, mail: mail }
                }
            }
        }
        return { response: matched, mail: mail }
    }
}



async function matching(arr, val) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i] === val)
            return true
    return false
}

async function validateUser(userEmail, userPhone, userAddress) {
    // Fetch the redFlagged email & Phone
    const snapshot = await RedFlagged.get();
    if (snapshot.empty) {
        console.log("RedFlagged Users are empty !!!");
        return false
    } else {
        const redEmails = snapshot.docs[0].data()['emails']
        const redPhones = snapshot.docs[0].data()['phoneNumbers']
        const redAddresses = snapshot.docs[0].data()['addresses']
        // Matching the emails
        let matched = await matching(redEmails, userEmail)
        // If emails didn't got matched check for the phone numbers
        if (matched === false) {
            matched = await matching(redPhones, userPhone.toString())
            if (matched === false) {
                // Match with the redAddresses
                matched = await matching(redAddresses, userAddress.toString())
            }
        }
        return matched
    }
}

app.post('/submitForApproval', async (req, res) => {
    const data = req.body
    // Change the names accordingly
    let zipCode = data.zipCode
    let emailAddress = data.applicantemail
    let phoneNumber = data.applicantphone
    let address = data.streetAddress_apartment
    try {
        let finalRes;
        let storeEmail;
        // Check if his zipcode matches
        await validateZipCodes(zipCode).then(async val => {
            // if val.repsonse is true if will return the store mail
            if (val.response) {
                // If Zip Matched Then Check if the user is valid to allow
                storeMail = val.mail
                await validateUser(emailAddress, phoneNumber, address).then(val => {
                    if (val)
                        finalRes = { msg: true, response: "Approved" }
                    else
                        finalRes = { msg: false, response: "RedFlaggedUser" }
                })
            } else
                finalRes = { msg: false, response: "ZipNotMatched" }
        })

        let uid = crypto.randomBytes(6).toString('hex');
        // Save to db wwith final assertion(response) if passed or not
        await Application.doc(uid).set({ data, uid: uid, result: finalRes.response })

        // two spaces are for toemail, subject
        // 'noreply.masterslease@gmail.com'
        await applicationMail(storeEmail, 'You Have A New Application Waiting')
        res.send(finalRes)

    } catch (e) {
        console.log(e);
        res.send({ msg: false, response: "error" })
    }
})

function tryLogin(email, password, req, res, response) {
    if ((req.body.emailAddress === email) && (req.body.password === password))
        res.send({ msg: true, response: response })
    else
        res.send({ msg: false })
}

app.post('/adminLogin', async (req, res) => {
    const snapshot = await Users.where('emailAddress', '==', req.body.emailAddress).get();
    if (snapshot.empty) {
        res.send({ msg: false })
    } else {
        let email = snapshot.docs[0].data()['emailAddress']
        let password = snapshot.docs[0].data()['password']
        tryLogin(email, password, req, res, snapshot.docs[0].data())
    }

})

app.get('/sendOTP', async (req, res) => {
    try {
        let otp = Math.floor(100000 + Math.random() * 900000)
        await OTPs.doc(req.query.emailAddress).set({ emailAddress: req.query.emailAddress, otp: otp });
        // Send as email
        await otpMail(req.query.emailAddress, 'Email Verification - Masterslease', otp)
        res.send({ msg: true })
    } catch (e) {
        console.log(e);
        res.send({ msg: false })
    }
})

app.get('/checkOTP', async (req, res) => {
    const snapshot = await OTPs.where('emailAddress', '==', req.query.emailAddress).get();
    if (snapshot.empty) {
        res.send({ msg: false })
    } else {
        if (snapshot.docs[0].data()['otp'] === parseInt(req.query.otp)) {
            res.send({ msg: true })
        } else
            res.send({ msg: false })
    }
})

module.exports = app