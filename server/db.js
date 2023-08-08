const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB_URI, connectionParams);
    console.log("connected to database successfully!");
  } catch (error) {
    console.log(error);
    console.log("could not connect to database!");
  }
};
