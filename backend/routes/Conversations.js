const express=require("express");
const { CreateConversations, FinduserById } = require("../controller/Conversations");
const router=express.Router();
router.post("/Conversations",CreateConversations).
get("/Conversations",FinduserById)

exports.router=router