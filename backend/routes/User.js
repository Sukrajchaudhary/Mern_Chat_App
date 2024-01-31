const express = require("express");
const router = express.Router();
const { createUser, loginUser, getAllUsers } = require("../controller/User");
router
  .post("/Signup", createUser)
  .post("/Login", loginUser)
  .get("/getUsers", getAllUsers)

exports.router = router;
