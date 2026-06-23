const db = require("../database/database");

class AuthController {
    
    async cadastro(req, res) {
        try {
            
            const { nome, email, cpf, senha, confirmarSenha, perfil } = req.body;

            
            if (senha !== confirmarSenha) {
                return res.status(400).json({ erro: "As senhas não coincidem" });
            }

            
            const [usuarioExiste] = await db.query(
                "SELECT * FROM usuarios WHERE email = ? OR cpf = ?", 
                [email, cpf]
            );
            
            if (usuarioExiste.length > 0) {
                return res.status(409).json({ erro: "E-mail ou CPF já cadastrado" });
            }

            
            const [resultado] = await db.query(
                "INSERT INTO usuarios (nome, email, cpf, senha, perfil) VALUES (?, ?, ?, ?, ?)", 
                [nome, email, cpf, senha, perfil]
            );

            
            return res.status(201).json({
                id: resultado.insertId, 
                nome, 
                email, 
                cpf,
                perfil 
            });

        } catch (err) {
            return res.status(500).json({ erro: "Erro interno no servidor", detalhe: err });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const [usuarioCadastrado] = await db.query("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha]);
            if (usuarioCadastrado.length === 0) return res.status(401).json({ erro: "Email ou senha inválidos" });

            const usuario = usuarioCadastrado[0];
            return res.status(200).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            });
            
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = new AuthController();