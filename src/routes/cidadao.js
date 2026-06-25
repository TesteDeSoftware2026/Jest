const express = require("express")
const router = express.Router()

const cidadaoController = require("../controllers/cidadaoController")

//criar e importar os controllers

router.get("/listar", cidadaoController.listarPoliticas);

router.get("/:id/solicitacoes", cidadaoController.listarSolicitacoes);

router.post("/:id/solicitacoes", cidadaoController.criarSolicitacao)

//exporta o "router"
module.exports = router

