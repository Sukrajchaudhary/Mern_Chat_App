const express = require("express");
const { checkAuth } = require("../controller/Auth");
const router = express.Router();
router.get("/checkAuth", checkAuth);
exports.router = router;
