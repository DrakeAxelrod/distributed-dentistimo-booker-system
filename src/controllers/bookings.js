const bookings = require("../models").bookings;
const clinics = require("../models").clinics;


const findClinic = async (name) => {
  return await clinics.findOne({ name: name })
};

const confirmAppointment = async (m) => {
  const obj = JSON.parse(m)
  const clinic = await findClinic(obj.clinic);
  const booking = await bookings
    .create({
      clinic: clinic._id,
      patient: obj.patient,
      time: obj.time,
      date: obj.date,
    })
    .then((res) => res)
    .catch((err) => ({ confirmed: false }));
  const allBookings = { ...booking._doc };
  if (!allBookings.hasOwnProperty["confirmed"]) {
    allBookings["confirmed"] = true
    allBookings.clinic = clinic;
  }
  return JSON.stringify(allBookings);
};

const allBookedAppointments = async (m) => {
  const msg = JSON.parse(m);
  const res = await bookings.find().populate("clinic").then(res => res).catch(err => []);
  return JSON.stringify({ message: msg, booked: res });
};

const isClinics = async () => {
  const res = await clinics.find({})
  return res.length > 0
}

module.exports = {
  confirmAppointment: confirmAppointment,
  allBookedAppointments: allBookedAppointments,
  isClinics: isClinics
};
