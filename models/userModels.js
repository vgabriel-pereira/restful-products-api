const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true, required: true },
    password: {type: String, required: true}
})

module.exports = new mongoose.model('Users', schema)