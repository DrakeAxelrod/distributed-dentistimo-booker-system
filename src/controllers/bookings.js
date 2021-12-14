const bookings = require("../models").bookings;
const clinics = require("../models").clinics;

const parseDate = (day) => {
  //'10:00-16:00'
  const times = day.split("-");
  const start = times[0].split(":");
  const end = times[1].split(":");
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
  return await clinics.findOne({ name: name })
};

const confirmAppointment = async (m) => {
  const obj = JSON.parse(m)
  const clinic = await findClinic(obj.clinic);
  const booking = await bookings.create({
    clinic: clinic._id,
    patient: obj.patient,
    time: obj.time,
    date: obj.date,
  });
  booking.clinic = clinic
  return JSON.stringify(booking);
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
  //available.forEach(e => console.log(e.time.start))
  return JSON.stringify(available);
};

const isClinics = async () => {
  const res = await clinics.find({})
  return res.length > 0
}

module.exports = {
  confirmAppointment: confirmAppointment,
  allAvailableForDayAppointments: allAvailableForDayAppointments,
  isClinics: isClinics
  // reserveAppointment: reserveAppointment
};
