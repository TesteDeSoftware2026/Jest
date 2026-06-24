const db = require("../database/database");

const criarPolitica = async(titulo,descricao,publico_alvo,local_atuacao)=>{

    const [politicaCriada] = await db.query(`
        INSERT INTO politica (titulo, descricao, publico_alvo, local_atuacao)
        VALUES (?, ?, ?, ?)`, [titulo, descricao, publico_alvo, local_atuacao]);

    return {
        id: politicaCriada.insertId,
        titulo,
        descricao,
        publico_alvo,
        local_atuacao
    }
}

const listarPolitica = async()=>{

    const [politicas] = await db.query(`SELECT * FROM politica`);

    if(politicas.length === 0){ 
        throw {status: 404, message: "Nenhuma politica encontrada"};
    }
    return politicas;
     
}

const atualizarPoliticas = async (id, titulo, descricao, publico_alvo, local_atuacao) => {

    const [resultado] = await db.query(
            `UPDATE politica SET titulo = ?, descricao = ?, publico_alvo = ?, local_atuacao = ? WHERE id = ?`,
            [titulo, descricao, publico_alvo, local_atuacao, id]
        );

    if (resultado.affectedRows === 0) {
        throw { status: 404, message: "Política pública não encontrada com o ID fornecido." };
    }

        return {
            id: Number(id),
            titulo,
            descricao,
            publico_alvo,
            local_atuacao
        };
};

module.exports ={
    criarPolitica,
    listarPolitica,
    atualizarPoliticas
};