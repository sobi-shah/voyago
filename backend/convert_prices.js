const mongoose = require('mongoose');
const Package = require('./models/Package');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const packages = await Package.find({});
    for (let pkg of packages) {
      if (pkg.price < 10000) { // Assume it's still in USD if less than 10k
          pkg.price = pkg.price * 280;
          await pkg.save();
      }
    }
    console.log("Prices updated to PKR.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
