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

const listarPolitica = async() => {

    const [politicas] = await db.query(`SELECT * FROM politica`);

    if(politicas.length === 0){ 
        throw {status: 404, message: "Nenhuma politica encontrada"};
    }

    return politicas;
     
}

const atualizarPoliticas = async (id, titulo, descricao, publico_alvo, local_atuacao) => {

    const [resultado] = await db.query(
            `update politica set titulo = ?, descricao = ?, publico_alvo = ?, local_atuacao = ? where id = ?`,
            [titulo, descricao, publico_alvo, local_atuacao, id]
        );

    if (resultado.affectedRows === 0) {
        throw { status: 404, message: "Política pública não encontrada com o ID fornecido" };
    }

        return {
            id: Number(id),
            titulo,
            descricao,
            publico_alvo,
            local_atuacao
        };
};

const deletarPolitica = async (id) => {
    const [politicaEncontrada] = await db.query(`
        select id
        from politica
        where id = ?
    `, [id])

    if (politicaEncontrada.length === 0) {
        throw {status: 404,message: "Política pública não encontrada com o ID fornecido"}
    }

    const [solicitacoesVinculadas] = await db.query(`
        select id
        from solicitacao
        where id_politica = ?
    `, [id])

    if (solicitacoesVinculadas.length > 0) {
        throw {status: 409,message: "Não é possível excluir esta política, pois existem solicitações vinculadas a ela"}
    }

    await db.query(`
        delete from politica
        where id = ?
    `, [id])

    return {id: Number(id),mensagem: "Política excluída com sucesso"}
}


module.exports ={
    criarPolitica,
    listarPolitica,
    atualizarPoliticas,
    deletarPolitica
};