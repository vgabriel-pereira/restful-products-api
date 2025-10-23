const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true, required: true },
    password: String
})

module.exports = new mongoose.model('Users', schema)