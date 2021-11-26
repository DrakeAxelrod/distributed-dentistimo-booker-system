const mongoose = require('mongoose')

let bookerSchema = new mongoose.Schema({
    available: {type: Boolean, default: true},
    patient: {type: Number, ref:"patient"},
    dentistid: {type: Number, ref:"dentist"},
    time: {type: String},
    date: {type: Date},
    issuance: {type: Date, default: Date.now()},
})

module.exports = mongoose.model('booker', bookerSchema)