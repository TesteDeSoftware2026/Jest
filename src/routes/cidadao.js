const express = require("express")
const router = express.Router()
const db = require("../database/database")

//criar e importar os controllers

router.get("/listar", async (req,res) =>{
    try{
        const [politicas] = await db.query(`
            select
            id,
            titulo,
            descricao,
            publico_alvo,
            local_atuacao
            from politica
            order by id desc
            `)

            res.status(200).json(politicas)
    }
    catch(err){res.status(500).json({erro: "Erro ao listar políticas públicas apara o cidadão"})}
});

router.get("/:id/solicitacoes", async (req,res) =>{

    try{
        const {id}= req.params

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

            res.status(200).json(solicitacoes)
    }
    catch(err){
        res.status(500).json({erro: "Erro ao listar solicitações do cidadão"})
    }
});

router.post("/:id/solicitacoes",async (req,res) =>{
    try{
        const {id} = req.params
        const {id_politica}= req.body

        if(!id_politica){
            return res.status(400).json({erro: "O campo id_policita é obrigatório"})
        }

        const [solicitacaoExistente] = await db.query(`
            select id
            from solicitacao
            where id_usuario = ?
            and id_politica = ?
            `,[id,id_politica])

        if(solicitacaoExistente.length > 0){
            return res.status(400).json ({erro: "Você já demonstrou interesse nessa política pública"});
        }

        const [resultado] = await db.query (`
            insert into solicitacao (
            id_usuario,
            id_politica,
            data_solicitacao,
            data_atualizacao,
            status_atual
            )
            values (?, ?, NOW(), NOW(), ?)
            `,[id,id_politica,"Pendente"])

        res.status(201).json({mensagem: "Solicitacao registrada com sucesso", id_solicitacao: resultado.insertId})
    }
    catch(err){
        res.status(500).json({erro: "Erro ao registrar solicitação do cidadão"})
    }
})

//exporta o "router"
module.exports = router

