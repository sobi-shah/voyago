const mongoose = require('mongoose');
const Package = require('./models/Package');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const packages = await Package.find({});
    console.log("Current packages in DB:", JSON.stringify(packages, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
