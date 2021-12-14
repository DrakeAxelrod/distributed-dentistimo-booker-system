const client = require("../utils/Client")
const controllers = require("../controllers");
const CircuitBreaker = require("opossum");

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};


const basePath = "api/bookings"
const responsePath = "api/gateway/bookings"

client.subscribe(basePath)
const topics = [
    { topic: "confirm", qos: 0 },
    { topic: "all", qos: 0 },
    { topic: "available", qos: 0 }
];
topics.forEach(route => {
    client.subscribe(basePath + "/" + route.topic, { qos: route.qos })
});

client.on("message", (t, m) => {
    const msg = m.toString()
    const topic = t.replace(basePath + "/", "");
    const breaker = new CircuitBreaker(client.emit(topic, msg), options);
    const result = breaker.fire().then(res => res).catch(console.error)
    //client.emit(topic, msg)
});

client.on('confirm', async(m) => {
    const booking = await controllers.bookings.confirmAppointment(m)
    const breaker = new CircuitBreaker(
      client.publish(responsePath + "/confirm", booking),
      options
    );
    const result = breaker
        .fire()
        .then((res) => res)
        .catch(console.error);
    //client.publish(responsePath + "/confirm", booking)
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
  const breaker = new CircuitBreaker(
    client.publish(responsePath + "/available", res),
    options
  );
  const result = breaker
        .fire()
        .then((res) => res)
        .catch(console.error);
  //client.publish(responsePath + "/available", JSON.stringify(res));
});

module.export = client;
