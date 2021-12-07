require('dotenv').config()
const model = require("./src/models").clinics
require('./src/routes')
require('./src/utils/DB').connect()
const axios = require("axios")