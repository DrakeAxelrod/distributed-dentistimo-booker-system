const mongoose = require('mongoose')

let bookerSchema = new mongoose.Schema({
    available: {type: Boolean, default: true},
    patient: {type: Number, ref:"patient"},
    dentistid: {type: Number, ref:"dentist"},
    time: {type: String, unique: true},
    date: {type: Date},
    issuance: {type: Date, default: Date.now()},
    Available: {type: Boolean, default: true}
})

module.exports = mongoose.model('booker', bookerSchema)