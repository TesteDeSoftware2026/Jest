const db = require("../database/database")

const listarPoliticas = async () => {

    const [politicas] = await db.query(`
        select * from politica
        order by id desc
    `)

    if(politicas.length === 0){ 
        throw {status: 404, message: "Nenhuma politica encontrada"};
    }

    return politicas
}

const listarSolicitacoes = async (id) => {
    const [solicitacoes] = await db.query(`
        select
            s.id,
            s.id_usuario,
            s.id_politica,
            p.titulo as politica,
            p.descricao,
            p.publico_alvo,
            p.local_atuacao,
            s.data_solicitacao,
            s.data_atualizacao,
            s.status_atual
        from solicitacao s
        inner join politica p
            on s.id_politica = p.id
        where s.id_usuario = ?
        order by s.data_solicitacao DESC
        `,[id])

    return solicitacoes
} 

const criarSolicitacao = async (id, id_politica) => {

    const [solicitacaoExistente] = await db.query(`
        select id
        from solicitacao
        where id_usuario = ?
        and id_politica = ?
        `,[id, id_politica])

    if(solicitacaoExistente.length > 0){
        throw {status: 400, message: "Você já demonstrou interesse nessa política pública"}
    }

    const [resultado] = await db.query (`
        insert into solicitacao (
            id_usuario,
            id_politica,
            data_solicitacao,
            data_atualizacao
        )
        values (?, ?, NOW(), NOW())
        `,[id, id_politica])

    return resultado
}

module.exports = { listarPoliticas, listarSolicitacoes, criarSolicitacao }