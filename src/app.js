//============================= CONFIGS ===========================
const express = require('express')
const path = require("path")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))


//============================= ROTAS ===========================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"))
})

const apiRouter = require("../src/routes/api")
app.use("/api", apiRouter)

//============================= EXPORT ===========================
module.exports = app