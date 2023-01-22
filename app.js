const express = require('express')
const cors = require('cors')
const { db } = require('./config')
const app = express()

require('dotenv').config()

const User = db.collection('Users')

app.listen(process.env.PORT, () => console.log("Running"))

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hari Bol")
})

module.exports = app