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
        if (error.status) {
            return res.status(error.status).json({ erro: error.message });
        }
        res.status(500).json({erro: "Erro ao listar políticas"});
    }
}

const atualizar = async (req,res)=>{
    try {
        const { id } = req.params;
        const{titulo,descricao,publico_alvo,local_atuacao} = req.body;
        
        if (!titulo || !descricao || !publico_alvo || !local_atuacao) {
            return res.status(400).json({ 
                erro: "Confira os campos para a atualizção" 
            });
        }

        const politica = await adminService.atualizarPoliticas(id, titulo, descricao, publico_alvo, local_atuacao);

        return res.status(200).json({ mensagem: "Política atualizada com sucesso!", politica });
    } catch (error) {
        if (error.status){
            return res.status(error.status).json({ erro: error.message });
        }


        res.status(500).json({erro: "Erro ao atualizar políticas"});
    }
}

module.exports = {
    criar,
    listar,
    atualizar
};