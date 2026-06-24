const express = require("express")
const router = express.Router()


//criar e importar os controllers
const adminController = require("../controllers/adminController");

//routas
router.post("/criar",adminController.criar)

router.get("/listar",adminController.listar);

//exporta o "router"
module.exports = router