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
    { topic: "confirm", qos: 2 },
    { topic: "all", qos: 2 },
    { topic: "available", qos: 2 }
];
topics.forEach(route => {
    client.subscribe(basePath + "/" + route.topic, { qos: route.qos })
});

const breaker = new CircuitBreaker(client.on("message", (t, m) => {
    const msg = m.toString()
    const topic = t.replace(basePath + "/", "");
    const breaker = new CircuitBreaker(client.emit(topic, msg), options);
    const result = breaker.fire().then(res => res).catch(console.error)
    //client.emit(topic, msg)
}), {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 25, // When 25% of requests fail, trip the circuit
  resetTimeout: 10000, // After 10 seconds, try again.
});
breaker.fire();

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
})

client.on("available", async (m) => {
  const res = await controllers.bookings
    .allBookedAppointments(m)
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
});

module.export = client;
