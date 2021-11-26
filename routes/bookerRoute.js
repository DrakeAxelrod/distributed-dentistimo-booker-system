var express = require('express')
var bookerRouter = express.Router()
let bodyParser = require('body-parser')
let bookerModel = require('../models/bookerSchema')
const mongoose = require('mongoose')

bookerRouter.use(bodyParser.json())
bookerRouter.use(bodyParser.urlencoded({extended: false}))

console.log('We\'re in the bookerRouter')

bookerRouter.route('/').get((req, res, next) => {
    bookerModel.find((error, booking) => {
        if (error) {return error}
        else {
            console.log('GET METHOD of booker')
            res.status(200).json({"bookings":booking})}
    })
}).post((req, res, next) => {
    let newBooking = new bookerModel({
        patient: req.body.patient,
        dentistid: req.body.dentistid,
        time: req.body.time,
        date: req.body.date
    })

   // let newBooking = new bookerModel(req.body)
    console.log(`NEW BOOKING: ${newBooking}`)

    newBooking.save(function(error, booking) {
        if (error) {console.log(error)}
        res.json({booking})
    })
})

module.exports = bookerRouter;