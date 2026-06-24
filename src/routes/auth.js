const express = require("express")
const router = express.Router()
const db = require("../database/database")

//criar e importar os controllers
const authController = require("../controllers/authController")

//rotas
router.post("/cadastro", authController.cadastro)

router.post("/login", authController.login)

//exporta o "router"
module.exports = router