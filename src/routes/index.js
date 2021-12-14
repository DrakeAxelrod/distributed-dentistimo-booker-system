const client = require("../utils/Client")
const controllers = require("../controllers");
const { log } = console;

const basePath = "api/bookings"
const responsePath = "api/gateway/bookings"

client.subscribe(basePath)
const topics = [
    { topic: "book", qos: 0 },
    { topic: "all", qos: 0 },
    { topic: "available", qos: 0 }
];
topics.forEach(route => {
    client.subscribe(basePath + "/" + route.topic, { qos: route.qos })
});

client.on("message", (t, m) => {
    const msg = m.toString()
    const topic = t.replace(basePath + "/", "");
    client.emit(topic, msg)
});

client.on('confirmAppointment', async() => {
    const booking = await controllers.bookings.confirmAppointment()
    client.publish(responsePath, Buffer.from(booking))
})

client.on("all", async (m) => {
  console.log("implement if needed")
    // const res = await controllers.bookings.allAppointments(m).then(res => res).catch((error) => {
    //     if (error) {
    //         console.log(error)
    //     }
    // })
    // client.publish(responsePath + '/all', JSON.stringify(res))
})

client.on("available", async (m) => {
  const res = await controllers.bookings
    .allAvailableForDayAppointments(m)
    .then((res) => res)
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
  client.publish(responsePath + "/available", JSON.stringify(res));
});

module.export = client;
