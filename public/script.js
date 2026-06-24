if(document.body.id == "login-cadastro"){

const btnIrParaCadastro = document.getElementById("btnIrParaCadastro")
const btnIrParaLogin = document.getElementById("btnIrParaLogin")

const cadastroForm = document.getElementById("cadastro-form")
const loginForm = document.getElementById("login-form")

const btnCadastrar = document.getElementById("btnCadastrar")
const btnEntar = document.getElementById("btnEntar")

loginForm.style.display = "none";

btnIrParaCadastro.addEventListener("click", () => {
    cadastroForm.style.display = "flex";
    loginForm.style.display = "none";
})

btnIrParaLogin.addEventListener("click", () => {
    loginForm.style.display = "flex";
    cadastroForm.style.display = "none";
})


cadastroForm.addEventListener("submit", async (event) => {
    //fazer requisição de cadastrar usuario
    event.preventDefault()

    const nome = document.getElementById("cadastro-nome").value
    const email = document.getElementById("cadastro-email").value
    const senha = document.getElementById("cadastro-senha").value
    const perfil = document.querySelector('input[name="cadastro-perfil"]:checked').value;

    console.log(nome, email, senha, perfil)

    const resposta = await fetch("/auth/cadastro", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nome, email, senha, perfil})
    })

    const dados = await resposta.json()

    if(resposta.ok){
        localStorage.setItem("usuarioLogado", JSON.stringify(dados))
        
        window.location.href = "/home"
    }

})

loginForm.addEventListener("submit", async () => {
    //fazer requisição de login

    const email = document.getElementById("login-email").value
    const senha = document.getElementById("login-senha").value

    const resposta = await fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, senha})
    })

    const dados = await resposta.json()
    const perfil = dados.perfil

    if(resposta.ok){
        localStorage.setItem("usuarioLogado", JSON.stringify(dados))
        
        window.location.href = "/home"
    }
})


}

if(document.body.id == "home"){

const btnLogout = document.getElementById("btnLogout")

btnLogout.addEventListener("click", () => {
    window.location.href = "/"
})

}