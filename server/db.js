const mongoose = require("mongoose");

exports.ConnectToDb = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/MERN_CHAT', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Couldn't connect to the database:", error.message);
  }
}
