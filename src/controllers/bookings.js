const bookings = require("../models").bookings;
const clinics = require("../models").clinics;

const parseDate = (day) => {
  //'10:00-16:00'
  const times = day.split("-");
  start = times[0].split(":");
  end = times[1].split(":");
  return {
    start: {
      hour: start[0],
      minute: start[1],
    },
    end: {
      hour: end[0],
      minute: end[1],
    },
  };
};

const getAllBookingsForDay = (msg, booked) => {
  bookedTimes = [];
  booked.forEach((e) => bookedTimes.push(e.time.start));
  const theDay = msg.clinic.openinghours[msg.date.dayName.toLowerCase()];
  const available = [];
  const day = parseDate(theDay);
  const start = parseInt(day.start.hour);
  const end = parseInt(day.end.hour);
  for (let i = start; i <= end; i++) {
    let hasHour = false;
    let hasThirty = false;
    let hasZeroZero = false;
    bookedTimes.forEach((e) => {
      if (e.hour === i) {
        hasHour = true;
        if (e.minute === 0) {
          hasZeroZero = true;
        }
        if (e.minute === 30) {
          hasThirty = true;
        }
      }
    });
    if (!hasZeroZero) {
      available.push({
        clinic: msg.clinic,
        patient: {},
        date: msg.date,
        time: {
          start: { hour: i, minute: 00 },
          end: { hour: i, minute: 30 },
        },
      });
    }
    if (!hasThirty) {
      available.push({
        clinic: msg.clinic,
        patient: {},
        date: msg.date,
        time: {
          start: { hour: i, minute: 30 },
          end: { hour: i + 1, minute: 00 },
        },
      });
    }
  }
  return available;
};

const findClinic = async (name) => {
  return await clinics.find({ name: name });
};
const confirmAppointment = async (m) => {
  const clinic = await findClinic(m.clinic);
  const booking = await bookings.create({
    clinic: clinic.id,
    patient: m.patient,
    time: m.time,
    date: m.date,
  });
  reservations[booking.id] = reserveBooking(booking.id);
  return booking;
  // clearTimeout(reservations[m.id])
};

const allAppointments = async (m) => {
  console.log("implement this...");
};

const allAvailableForDayAppointments = async (m) => {
  const msg = JSON.parse(m);
  const clinicName = msg.clinic.name;
  const res = await bookings.find().populate("clinic");

  const bookedAppointments = res.filter((booked) => {
    const sameName = booked.clinic.name === clinicName;
    const sameYear = msg.date.year === booked.date.year;
    const sameDay = msg.date.day === booked.date.day;
    const sameMonth = msg.date.month === booked.date.month;
    const sameDate = sameDay && sameMonth && sameYear;
    if (sameName && sameDate) return booked;
  });
  const available = getAllBookingsForDay(msg, bookedAppointments);
  available.forEach(e => console.log(e.time.start))
  return available;
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
  allAvailableForDayAppointments: allAvailableForDayAppointments,
  // reserveAppointment: reserveAppointment
};
