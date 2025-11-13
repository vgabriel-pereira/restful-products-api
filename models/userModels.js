const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    roles: { type: [String], enum: ['customer', 'admin'], default: ['customer'] },
    createdAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model('User', schema)