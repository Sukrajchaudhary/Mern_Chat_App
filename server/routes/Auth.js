const express = require("express");
const { checkAuth, Logout } = require("../controller/Auth");
const router = express.Router();
router.get("/checkAuth", checkAuth).get("/logout", Logout);
exports.router = router;
