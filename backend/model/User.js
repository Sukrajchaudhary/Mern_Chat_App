const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token:{
    type:String,
    require:true
  }
}, { timestamps: true });

exports.User = mongoose.model("User", userSchema);
