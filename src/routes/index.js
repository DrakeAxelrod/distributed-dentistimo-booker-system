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
];
// loop subscribe
topics.forEach(route => {
    //log(basePath + "/" + route.topic);
    client.subscribe(basePath + "/" + route.topic, { qos: route.qos })
});

// emit the topic
client.on("message", (t, m) => {
    const msg = JSON.parse(m.toString())
    const topic = t.replace(basePath + "/", "");
    //log(topic)
    if (topic === "api/bookings") {
        client.emit("/")
    } else {
        client.emit(topic, msg)
    }
});

// this is where routes go
// so you listen for the topic and call relevant controller functions
client.on('/createAppointment', async() => {
    const res = await controllers.bookings.createAppointment()
    client.publish(responsePath, Buffer.from(res))
})

client.on("/", async () => {
    const res = await controllers.bookings.allAppointments()
    // log(res)
    // send back to gateway
    client.publish(responsePath, Buffer.from(res))
})



module.export = client;
