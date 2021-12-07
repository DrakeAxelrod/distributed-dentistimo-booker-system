const client = require("../utils/Client")
const controllers = require("../controllers");
const { log } = console;

// set up base path
const basePath = "api/bookings"
const responsePath = "api/gateway/bookings"

client.subscribe(basePath)
// add topics to listen to
const topics = [
    { topic: "book", qos: 0 },
    { topic: "check", qos: 0 },
    { topic: "initiate", qos: 0},
    { topic: "all", qos: 0 }
];
// loop subscribe
topics.forEach(route => {
    //log(basePath + "/" + route.topic);
    client.subscribe(basePath + "/" + route.topic, { qos: route.qos })
});

// emit the topic
client.on("message", (t, m) => {
    const msg = m.toString()

    const topic = t.replace(basePath + "/", "");

    client.emit(topic, msg)
});

// this is where routes go
// so you listen for the topic and call relevant controller functions
client.on('confirmAppointment', async() => {
    const booking = await controllers.bookings.confirmAppointment()
    client.publish(responsePath, Buffer.from(bookin))
})

client.on('initiate', async() => {
    const res = await controllers.bookings.reserveAppointment()
    client.publish(responsePath, Buffer.from(res))
})

client.on("all", async () => {
    const res = await controllers.bookings.allAppointments().then(res => res).catch((error) => {
        if (error) {
            console.log(error)
        }
    })


    // log(res)
    // send back to gateway


    client.publish(responsePath + '/all', JSON.stringify(res))
})


module.export = client;
