const express = require("express");
const routes = express.Router();
const AuthController = require("../controller/authController")
const {authenticateToken}  = require("../middleware/authCheck")


routes.post("/login", AuthController.login)
routes.get("/users", authenticateToken,AuthController.getUserList)

// routes.get("/", (req,res) => {
//     return res.render('socket')
// })

// routes.get("/chat", (req,res) => {
//     return res.render('socket/index2')
// })

module.exports = routes