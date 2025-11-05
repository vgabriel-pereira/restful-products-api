const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
    description: { type: String, required: true, minLength: 3 },
    price: { type: Number, required: true, min: 0.01 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', schema)