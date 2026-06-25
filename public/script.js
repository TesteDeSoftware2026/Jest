//========================== LOGIN.HTML ===============================
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

    const resposta = await fetch("/auth/cadastro", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nome, email, senha, perfil})
    })

    const dados = await resposta.json()

    if(resposta.status == 201){
        localStorage.setItem("usuarioLogado", JSON.stringify(dados))
        
        window.location.href = "/home"
    }else{
        window.location.href = "/politicas"
    }

})

loginForm.addEventListener("submit", async (event) => {
    //fazer requisição de login
    event.preventDefault()

    const email = document.getElementById("login-email").value
    const senha = document.getElementById("login-senha").value

    console.log(email, senha)

    const resposta = await fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, senha})
    })

    const dados = await resposta.json()
    const perfil = dados.perfil

    if(resposta.status == 200){
        localStorage.setItem("usuarioLogado", JSON.stringify(dados))
        
        window.location.href = "/home"
    }else{
        window.location.href = "/login"
    }
})


}

//================================== HOME.HTML ==============================

if(document.body.id == "home"){

const btnLogout = document.getElementById("btnLogout")

btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado")
    window.location.href = "/"
})

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

const navbar = document.querySelector("nav.header-nav")
const btnArea = document.getElementById("btn-area")
const btnNomePerfil = document.getElementById("btn-nome-perfil")

const areaText = usuarioLogado.perfil == "admin" ? "Painel Admin" : "Minha Area"
const nomeText = usuarioLogado ? usuarioLogado.nome : "User"

btnArea.textContent = areaText
btnNomePerfil.textContent = nomeText

btnArea.addEventListener("click", () => {
    if(usuarioLogado.perfil == "admin"){
        window.location.href = "/admin"
    }else{
        window.location.href = "/cidadao"
    }
})

const politicasSection = document.getElementById("politicas-section")

console.log("antes da função")

carregarPoliticas()

async function carregarPoliticas() {
    try{

        console.log("antes do fetch ")
        console.log(usuarioLogado.perfil)

        const resposta = await fetch(`/${usuarioLogado.perfil}/listar`, {
            method: "GET"
        })

        console.log("depois do fetch ")

        const dados = await resposta.json()

        politicasSection.innerHTML = ""

        dados.forEach(politica => {
            const article = `
                <article class="policy-card">

                    <span class="tag">
                        Saúde
                    </span>

                    <h3>
                        ${politica.titulo}
                    </h3>

                    <p>
                        ${politica.descricao}
                    </p>

                    <ul>
                        <li>${politica.publico_alvo}</li>
                        <li>${politica.local_atuacao}</li>
                    </ul>

                    <button 
                    class="details-button"
                    onclick=detalhePolitica(${politica.id})
                    >
                        Ver Detalhes →
                    </button>

                </article>
            `

            politicasSection.innerHTML += article
        });

    }catch(error){
        console.error("Erro ao carregar politicas", error)
    }
}


}


//================================ CIDADAO.HTML ====================================
if(document.body.id == "cidadao"){
    
const btnLogout = document.getElementById("btnLogout")

btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado")
    window.location.href = "/"
})

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

const navbar = document.querySelector("nav.header-nav")
const btnArea = document.getElementById("btn-area")
const btnNomePerfil = document.getElementById("btn-nome-perfil")

const areaText = usuarioLogado.perfil == "admin" ? "Painel Admin" : "Minha Area"
const nomeText = usuarioLogado ? usuarioLogado.nome : "User"

btnArea.textContent = areaText
btnNomePerfil.textContent = nomeText

btnArea.addEventListener("click", () => {
    if(usuarioLogado.perfil == "admin"){
        window.location.href = "/admin"
    }else{
        window.location.href = "/cidadao"
    }
})

const btnHome = document.getElementById("btn-home")

btnHome.addEventListener("click", () => {
    window.location.href = "/home"
})

async function carregarPoliticas() {
    try{

        const resposta = await fetch(`/cidadao/carregarPoliticas`, {
            method: "GET"
        })

        const dados = resposta.json()

        dados.forEach(politica => {

            const linhaTabela = `
                <tr>

                    <td>

                        <strong>
                            ${politica.titulo}
                        </strong>

                        <p>
                            ${politica.descricao}
                        </p>

                    </td>

                    <td>
                        <span class="category-tag">
                            Saúde
                        </span>
                    </td>

                    <td>${politica.local_atuacao}</td>

                    <td>
                        ${politica.publico_alvo}
                    </td>

                    <td class="actions-cell">

                        <button
                        class="edit-button"
                        onclick=editarPolitica(${politica.id})
                        >
                            ✏
                        </button>

                        <button 
                        class="delete-button"
                        onclick=deletarPolitica(${politica.id})
                        >
                            🗑
                        </button>

                    </td>

                </tr>
            `
        })

    }catch(error){
        console.error("Erro ao carregar politicas", error)
    }
}

}


//================================ ADMIN.HTML ====================================
if(document.body.id == "admin"){

const btnLogout = document.getElementById("btnLogout")

btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado")
    window.location.href = "/"
})

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

const navbar = document.querySelector("nav.header-nav")
const btnArea = document.getElementById("btn-area")
const btnNomePerfil = document.getElementById("btn-nome-perfil")

const areaText = usuarioLogado.perfil == "admin" ? "Painel Admin" : "Minha Area"
const nomeText = usuarioLogado ? usuarioLogado.nome : "User"

btnArea.textContent = areaText
btnNomePerfil.textContent = nomeText

btnArea.addEventListener("click", () => {
    if(usuarioLogado.perfil == "admin"){
        window.location.href = "/admin"
    }else{
        window.location.href = "/cidadao"
    }
})

const btnHome = document.getElementById("btn-home")

btnHome.addEventListener("click", () => {
    window.location.href = "/home"
})

const bodyTabela = document.getElementById("bodyTabela")

let politicasCache = []

carregarPoliticas()

async function carregarPoliticas() {
    try{


        const resposta = await fetch(`/admin/listar`, {
            method: "GET"
        })

        const dados = await resposta.json()
        politicasCache = dados || []

        bodyTabela.innerHTML = ""

        politicasCache.forEach(politica => {

            const linhaTabela = `
                <tr>

                    <td>

                        <strong>
                            ${politica.titulo}
                        </strong>

                        <p>
                            ${politica.descricao}
                        </p>

                    </td>

                    <td>
                        <span class="category-tag">
                            Saúde
                        </span>
                    </td>

                    <td>${politica.local_atuacao}</td>

                    <td>
                        ${politica.publico_alvo}
                    </td>

                    <td class="actions-cell">

                        <button
                        class="edit-button"
                        onclick=abrirEdicao(${politica.id})
                        >
                            ✏
                        </button>

                        <button 
                        class="delete-button"
                        onclick=deletarPolitica(${politica.id})
                        >
                            🗑
                        </button>

                    </td>

                </tr>
            `

            bodyTabela.innerHTML += linhaTabela
        })

    }catch(error){
        console.error("Erro ao carregar politicas", error)
    }
}

const btnVaiCadastrar = document.getElementById("btnVaiCadastrar")
const btnEnviarForm = document.getElementById("btnEnviarForm")
const btnCancelarCadastro = document.getElementById("btnCancelarCadastro")
const adminForm = document.getElementById("admin-form")

const titulo = document.getElementById("form-titulo")
const descricao = document.getElementById("form-descricao")
const publico = document.getElementById("form-publico")
const local = document.getElementById("form-local")
let idEdicao = null

adminForm.style.display = "none"

btnCancelarCadastro.addEventListener("click", () => {
    adminForm.style.display = "none"
})


btnVaiCadastrar.addEventListener("click", async function cadastrarPolitica(){

    adminForm.style.display = "flex"
    btnEnviarForm.textContent = "Cadastrar"
    idEdicao = null
})

function abrirEdicao(id){

    adminForm.style.display = "flex"
    btnEnviarForm.textContent = "Editar"

    const politica = politicasCache.find((item) => item.id == id)

    titulo.value = politica.titulo
    descricao.value = politica.descricao
    publico.value = politica.publico_alvo
    local.value = politica.local_atuacao

    idEdicao = id
}

btnEnviarForm.addEventListener("click", async (event) => {
        event.preventDefault()

        const dadosFormulario = {
            titulo: titulo.value,
            descricao: descricao.value,
            publico_alvo: publico.value,
            local_atuacao: local.value
        };

        // Define dinamicamente qual será a URL e o Método com base na nossa variável de controle
        let url = "/admin/criar";
        let metodo = "POST";

        // Se houver um ID guardado na variável global, muda o comportamento para Edição
        if (idEdicao !== null) {
            url = `/admin/editar/${idEdicao}`;
            metodo = "PUT";
        }

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosFormulario)
            });

            if (resposta.ok) {
                // Exibe mensagem dinâmica baseada na ação realizada
                const acao = idEdicao ? "editada" : "cadastrada";
                alert(`Política ${acao} com sucesso!`);
                
                adminForm.style.display = "none"; 
                adminForm.reset(); 
                idEdicao = null; // Reseta a variável de controle
                
                // Dica: Chame sua função carregarPoliticas() aqui para atualizar a tabela na tela!
            } else {
                console.error("O servidor respondeu com erro:", resposta.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
        
    })

}

