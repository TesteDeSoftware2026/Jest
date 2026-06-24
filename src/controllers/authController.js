const authService = require("../services/authService")

const cadastro = async (req, res) => {

    try{
        const { nome, email, senha, perfil } = req.body
        
        const usuario = await authService.cadastro(nome, email, senha, perfil)
        
        res.status(201).json(usuario)
        
    }catch(err){
        res.status(500).json(err)
    }
}

const login = async (req, res) => {

    try{
        const { email, senha } = req.body

        const usuario = await authService.login(email, senha)

        res.status(200).json(usuario)
        
    }catch(err){
        res.status(500).json(err)
    }
}

module.exports = { cadastro, login };