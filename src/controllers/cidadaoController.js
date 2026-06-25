const cidadaoService = require("../services/cidadaoService")

const listarPoliticas = async (req, res) => {
    try{
    
        const politicas = await cidadaoService.listarPoliticas()

        res.status(200).json(politicas)
    
    }catch(error){
        if (error.status) {
            return res.status(error.status).json({ erro: error.message });
        }
        res.status(500).json({erro: "Erro ao listar políticas públicas apara o cidadão"})
    }
}

const listarSolicitacoes = async (req, res) => {

    try{
        const { id }= req.params

        const solicitacoes = await cidadaoService.listarSolicitacoes(id)

        res.status(200).json(solicitacoes)
    }catch(err){
        res.status(500).json({erro: "Erro ao listar solicitações do cidadão"})
    }
}

const criarSolicitacao = async (req, res) =>{

    try{
        const {id} = req.params
        const {id_politica}= req.body

        if(!id_politica){
            return res.status(400).json({erro: "O campo id_policita é obrigatório"})
        }

        const resultado = await cidadaoService.criarSolicitacao(id, id_politica)

        res.status(201).json({mensagem: "Solicitacao registrada com sucesso", id_solicitacao: resultado.insertId})
    }catch(err){
        res.status(500).json({erro: "Erro ao registrar solicitação do cidadão"})
    }
}


module.exports = { listarPoliticas, listarSolicitacoes, criarSolicitacao }