const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String
})

module.exports = new mongoose.model('Users', schema)