const mongoose = require('mongoose');
const Package = require('./models/Package');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
        const packages = await Package.find({});
        console.log("PACKAGES_COUNT:", packages.length);
    } catch(e) {
        console.error("DB_ERROR:", e);
    }
    process.exit(0);
  })
