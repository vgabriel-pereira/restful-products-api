const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    description: String,
    value: parseFloat
})

module.exports = new mongoose.model('Product', schema)