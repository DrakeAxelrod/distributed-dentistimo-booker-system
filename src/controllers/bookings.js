const model = require("../models").bookings
const { log } = console;

const createAppointment = async (booking) => {
    await model.create(booking, (err) => {
        if (err) {
            log(err)
        }
        else {return booking}
    })
}

const allAppointments = async () => {
    const res = await model.find().then((res) => res).catch((err) => log(err));
    return res
};

module.exports = {
    allAppointments: allAppointments,
    createAppointment: createAppointment,
};
