const mongoose = require("mongoose");

exports.ConnectToDb = async () => {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Add this line to use the new Server Discover and Monitoring engine
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Couldn't connect to the database:", error.message);
  }
};
