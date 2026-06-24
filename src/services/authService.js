const db = require("../database/database");

const cadastro = async (nome, email, senha, perfil) => {
    
    const [usuarioExiste] = await db.query(`
        select id from usuario
        where email = ?`, [email])

    if(usuarioExiste.length > 0) throw { status: 409, message: 'E-mail já cadastrado' }

    /* futuramente
    const hash = await bcrypt.hash(senha, 10)

     const [resultado] = await db.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hash]
    )
     */

    const [usuarioCriado] = await db.query(`
        insert into usuario (nome, email, senha, perfil)
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
        select * from usuario
        where email = ? and senha = ?`, [email, senha])

    if(usuarioExiste.length === 0) throw {status: 404, message: "Conta não encontrada"}

    const dados = usuarioExiste[0]

    /* futuramente
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta)
        throw { status: 401, message: 'Senha incorreta' }
    */

    return dados
}

module.exports = { cadastro, login }