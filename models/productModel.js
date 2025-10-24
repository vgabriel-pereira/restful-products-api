const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
    description: { type: String, required: true, minLength: 3 },
    value: { type: parseFloat, required: true, minLength: 3 }
})

module.exports = new mongoose.model('Product', schema)