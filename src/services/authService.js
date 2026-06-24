const db = require("../database/database");

const cadastro = async (nome, email, senha, perfil) => {
    
    const [usuarioExiste] = await db.query(`
        select id from usuarios
        where id = ?`, [email])

    if(usuarioExiste.length > 0) throw { status: 409, message: 'E-mail já cadastrado' }

    /* futuramente
    const hash = await bcrypt.hash(senha, 10)
     */

    const [usuarioCriado] = await db.query(`
        insert into usuarios (nome, email, senha, perfil)
        values (?, ?, ?, ?)`, [nome, email, senha, perfil])

    return {
        id: usuarioCriado.insertId,
        nome,
        email,
        perfil
    }
}

const login = async (email, senha) => {

    const [usuarioExiste] = await db.query(`
        select * from usuarios
        where email = ? and senha = ?`, [email, senha])

    if(usuarioExiste.length < 1) throw {staus: 401, message: "Conta não encontrada"}

    const dados = usuarioExiste[0]

    /* futuramente
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta)
        throw { status: 401, message: 'Senha incorreta' }
    */

    return dados
}

module.exports = { cadastro, login }