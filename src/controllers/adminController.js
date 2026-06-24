const adminService = require("../services/adminService");

const criar = async(req,res)=>{
    try {
        const{titulo,descricao,publico_alvo,local_atuacao} = req.body;
        
        if (!titulo || !descricao || !publico_alvo || !local_atuacao) {
            return res.status(400).json({ 
                erro: "Todos os campos são obrigatórios!" 
            });
        }


        const politica = await adminService.criarPolitica(titulo,descricao,publico_alvo,local_atuacao);

        res.status(201).json(politica);
    } catch (error) {
        res.status(500).json({
        erro: "Erro ao criar política"});
    }
}

const listar = async(req,res)=>{

    try {
        const politicas = await adminService.listarPolitica();

        return res.status(200).json(politicas);
        
    } catch (error) {
        res.status(500).json({
        erro: "Erro ao listar políticas"});
    }
}

module.exports = {
    criar,
    listar
};