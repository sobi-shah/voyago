const mongoose = require('mongoose');
const Package = require('./models/Package');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Package.deleteMany({});
    console.log("Deleted old packages. Will be reseeded on next request.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
