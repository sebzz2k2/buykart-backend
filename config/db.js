const mongoose = require("mongoose");

const db = async () => {
  await mongoose
    .connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log("Connection to db failed", err));
};

module.exports = db;
