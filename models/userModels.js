const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false }
})

module.exports = mongoose.model('User', schema)