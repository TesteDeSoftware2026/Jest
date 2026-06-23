//============================= CONFIGS ===========================
const express = require('express')
const path = require("path")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

//========================== CONEXAO DB ============================
const db = require("../src/database/database");


//============================= ROTAS HTML ===========================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"))
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/home.html"))
})

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/admin.html"))
})

app.get('/cidadao', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/cidadao.html"))
})

app.get('/politicas', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/politicas.html"))
})


//============================= ROTAS API ===========================

const apiRouter = require("../src/routes/api")
app.use("/api", apiRouter)

//============================= EXPORT ===========================
module.exports = app