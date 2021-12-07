require('dotenv').config()

const { log } = console;
const client = mqtt.connect({
  hostname: process.env.BROKER_URI,
  username: process.env.BROKER_USERNAME,
  password: process.env.BROKER_PASSWORD,
  protocol: "wss",
});

client.on("connect", (ack, err) => {
  if (!err) {
    console.log("connected");
    // setInterval(
    //   () => client.publish("booking", "message from booking-management"),
    //   1000
    // );
  } else {
    console.log(err);
  }
});

// client.subscribe("gateway");

client.on("message", (topic, message) => {
  log(message.toString());
  if (message.toString() === "stop") {
    client.end();
  }
});
/*
let databaseVariable = process.env.MONGODB_URI
let port = process.env.port || 3000

mongoose.connect(databaseVariable, (error) => {
    if (error) {console.log('Could not connect to database!'); process.exit(0)}
    else {console.log('Successfully connected to database!')}
})
let bookingApp = express()
bookingApp.use(express.json())
bookingApp.options('*', cors())
bookingApp.use(cors())
bookingApp.use(bodyParser.urlencoded({extended: false}))
bookingApp.use(bodyParser.json())

bookingApp.use("/api/bookings", require('./routes/bookerRoute'));
bookingApp.use("/api", function() {
    console.log('/api not implemented yet')
});

bookingApp.listen(port, (error) => {
    if (error) {throw error}
    else {console.log(`Listening to port: ${port}`)}
})

module.exports = bookingApp;
*/