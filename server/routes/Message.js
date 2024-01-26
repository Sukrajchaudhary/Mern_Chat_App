const express = require("express");
const router = express.Router();
const { CreateMessage, getMessage } = require("../controller/Message");
router
  .post("/message", CreateMessage)
  .get("/getmessage/:coneversationsId", getMessage);
exports.router = router;
