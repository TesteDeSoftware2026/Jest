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


btnCadastrar.addEventListener("click", () => {
    //fazer requisição de cadastrar usuario
})

btnEntar.addEventListener("click", () => {
    //fazer requisição de login
})


}

if(document.body.id == "home"){

const btnLogout = document.getElementById("btnLogout")

btnLogout.addEventListener("click", () => {
    window.location.href = "/"
})

}