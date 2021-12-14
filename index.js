require('dotenv').config()
require('./src/routes')
require("./src/utils/DB").connect();
const controllers = require("./src/controllers")
const populateClinics = require("./src/utils/populateClinics");

const popClinicsIfNeeded = async () => {
  const exists = await controllers.bookings.isClinics()
  if (!exists) {
    populateClinics()
  }
}
popClinicsIfNeeded()
