const express = require('express')
const cors = require('cors')
const { db } = require('./config')
const app = express()

require('dotenv').config()

// Applications
const Application = db.collection('Application')
const RedFlagged = db.collection('RedFlagged')
const ZipCodes = db.collection('ZipCode')

app.listen(process.env.PORT, () => console.log("Running"))

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hey Hari Bol !!! It's Working...")
})

async function validateZipCodes(zipCode) {
    // Fetch the allowed zipcodes from DB
    const snapshot = await ZipCodes.get();
    if (snapshot.empty) {
        console.log("ZipCodes are empty !!!");
        return false
    } else {
        const zipCodes = snapshot.docs[0].data()['zipcodes']
        let matched = false
        zipCodes.map(data => {
            // Match it with the param and return true or false
            if (data === zipCode)
                matched = true
        })
        return matched
    }
}

async function matching(arr, val) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i] === val)
            return true
    return false
}

async function validateUser(userEmail, userPhone) {
    // Fetch the redFlagged email & Phone
    const snapshot = await RedFlagged.get();
    if (snapshot.empty) {
        console.log("RedFlagged Users are empty !!!");
        return false
    } else {
        const redEmails = snapshot.docs[0].data()['emails']
        const redPhones = snapshot.docs[0].data()['phoneNumbers']
        // Matching the emails
        let matched = await matching(redEmails, userEmail)
        // If emails didn't got matched check for the phone numbers
        if (matched === false) {
            matched = await matching(redPhones, userPhone.toString())
        }
        return matched
    }
}

app.post('/submitForApproval', async (req, res) => {
    const data = req.body
    // Change the names accordingly
    let zipCode = data.zipCode
    let emailAddress = data.emailAddress
    let phoneNumber = data.phoneNumber
    try {
        let finalRes;
        // Check if his zipcode matches
        await validateZipCodes(zipCode).then(async val => {
            if (val) {
                // If Zip Matched Then Check if the user is valid to allow
                await validateUser(emailAddress, phoneNumber).then(val => {
                    if (val)
                        finalRes = { msg: true, response: "Approved" }
                    else
                        finalRes = { msg: false, response: "RedFlaggedUser" }
                })
            } else
                finalRes = { msg: false, response: "ZipNotMatched" }
        })

        // Save to db wwith final assertion(response) if passed or not

    } catch (e) {
        console.log(e);
        res.send({ msg: false, response: "error" })
    }
})

module.exports = app