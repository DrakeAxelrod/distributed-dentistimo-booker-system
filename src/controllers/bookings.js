const bookings = require("../models").bookings
const clinics = require("../models").clinics

const parseDate = (day) => {
//'10:00-16:00'
    console.log(day)
    const times = day.split("-")
    start = times[0].split(":")
    end = times[1].split(":")
    return {
        start: {
        hour: start[0],
        minute: start[1]
        },
        end: {
        hour: end[0],
        minute: end[1]
        }
    }
}

const getAllBookingsForDay = (msg) => {
    const theDay = msg.clinic.openinghours[msg.date.dayName.toLowerCase()]
    const available = []
    const day = parseDate(theDay)
    const start = parseInt(day.start.hour) 
    const end = parseInt(day.end.hour)
    for (let i = start; i <= end; i++) {
        available.push({
            clinic: msg.clinic,
            patient: {},
            date: msg.date,
            time: { 
                start: { hour: i, minute: 00 }
            }
        })
        available.push({
            clinic: msg.clinic,
            patient: {},
            date: msg.date,
            time: { 
                start: { hour: i, minute: 30 }
            }
        })
    }
    return available
}
// const reserveBooking = (id) => {
//     return setTimeout(() => {
//         bookings.findByIdAndDelete(id)
//     }, 1000 * 60 * 15)
// }

const findClinic = async (name) => {
    return  await clinics.find({ name: name})
}
const confirmAppointment = async (m) => {
    const clinic = await findClinic(m.clinic)
    const booking = await bookings.create({
        clinic: clinic.id, 
        patient: m.patient,
        time: m.time,
        date: m.date,
    })
    reservations[booking.id] = reserveBooking(booking.id)
    return booking
    // clearTimeout(reservations[m.id])
}

const allAppointments = async (m) => {
    const msg = JSON.parse(m)
    const clinicName = msg.clinic.name
   // const promise = model.find();
    const res = await bookings.find().populate("clinic")
    // const clinicID = [ "61afc9f009bd4117c4602c47", "61afc9f009bd4117c4602c4a", "61afc9f009bd4117c4602c48", "61afc9f009bd4117c4602c49" ]
    // clinicID.forEach( c => {
    //     bookings.create({
    //         clinic: c,
    //         patient: {
    //             email: "yo",
    //             name: "yo",
    //             personalNumber: "yo",
    //             phone: 123,
    //         },
    //         time: { // 30 minute fika break & 1 hour lunch break
    //             start: {
    //                 hour: 8,
    //             } // ends 30 minutes later aka 8:00 -> 8:30
    //         },
    //         date: {
    //             day: 29,
    //             month: 12,
    //             year: 2021
    //         }
    //     })
    // })
    const available = getAllBookingsForDay(msg)
    console.log(available)
    const arr = []
    const filtered = res.filter(booked => {
        const sameName = booked.clinic.name === clinicName
        const sameYear = msg.date.year === booked.date.year
        const sameDay = msg.date.day === booked.date.day
        const sameMonth = msg.date.month === booked.date.month
        const sameDate = sameDay && sameMonth && sameYear
        if (sameName && sameDate) {
            return booked
        }
    })
    
    const availableAppointments = [] 
     available.filter(a => {
        console.log(a.time)
    })
    
   // const res = await promise.then(res => res).catch(err => {console.log(err)})
    return arr
};

// const reserveAppointment = async (m) => {
//     const clinic = await findClinic(m.clinic)
//     const booking = await bookings.create({
//         clinic: clinic.id, 
//         patient: m.patient,
//         time: m.time,
//         date: m.date,
//     })
//     reservations[booking.id] = reserveBooking(booking.id)
//     return booking
// }

module.exports = {
    allAppointments: allAppointments,
    confirmAppointment: confirmAppointment,
    // reserveAppointment: reserveAppointment
};
