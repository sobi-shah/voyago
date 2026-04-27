const mongoose = require('mongoose');

const uri = "mongodb://admin:admin123@ac-mzblinz-shard-00-00.z4qh30b.mongodb.net:27017,ac-mzblinz-shard-00-01.z4qh30b.mongodb.net:27017,ac-mzblinz-shard-00-02.z4qh30b.mongodb.net:27017/voyago?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAIL:", err);
    process.exit(1);
  });
