const bookings = require("../models").bookings
const clinics = require("../models").clinics
const { log } = console;


const reservations = {}

const reserveBooking = (id) => {
    return setTimeout(() => {
        bookings.findByIdAndDelete(id)
    }, 1000 * 60 * 15)
}

const findClinic = async (name) => {
    return  await clinics.find({ name: name})
}
const confirmAppointment = async (m) => {
    clearTimeout(reservations[m.id])
}

const allAppointments = async () => {
    console.log('AllAppointments')


   // const promise = model.find();
    const res = bookings.find({})
   // const res = await promise.then(res => res).catch(err => {console.log(err)})
    return res
};

const reserveAppointment = async (m) => {
    const clinic = await findClinic(m.clinic)
    const booking = await bookings.create({
        clinic: clinic.id, 
        patient: m.patient,
        time: m.time,
        date: m.date,
    })
    reservations[booking.id] = reserveBooking(booking.id)
    return booking
}

module.exports = {
    allAppointments: allAppointments,
    confirmAppointment: confirmAppointment,
    reserveAppointment: reserveAppointment
};
