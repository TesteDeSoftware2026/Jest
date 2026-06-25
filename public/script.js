function formatarData(data) {
    if (!data) return "-";  
    return new Date(data).toLocaleDateString("pt-BR");
}  

//========================== LOGIN.HTML ===============================
if (document.body.id == "login-cadastro") {
  const btnIrParaCadastro = document.getElementById("btnIrParaCadastro");
  const btnIrParaLogin = document.getElementById("btnIrParaLogin");

  const cadastroForm = document.getElementById("cadastro-form");
  const loginForm = document.getElementById("login-form");

  const btnCadastrar = document.getElementById("btnCadastrar");
  const btnEntar = document.getElementById("btnEntar");

  loginForm.style.display = "none";

  btnIrParaCadastro.addEventListener("click", () => {
    cadastroForm.style.display = "flex";
    loginForm.style.display = "none";
  });

  btnIrParaLogin.addEventListener("click", () => {
    loginForm.style.display = "flex";
    cadastroForm.style.display = "none";
  });

  cadastroForm.addEventListener("submit", async (event) => {
    //fazer requisição de cadastrar usuario
    event.preventDefault();

    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const senha = document.getElementById("cadastro-senha").value;
    const perfil = document.querySelector(
      'input[name="cadastro-perfil"]:checked',
    ).value;

    const resposta = await fetch("/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, perfil }),
    });

    const dados = await resposta.json();

    if (resposta.status == 201) {
      localStorage.setItem("usuarioLogado", JSON.stringify(dados));

      window.location.href = "/home";
    } else {
      window.location.href = "/politicas";
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    //fazer requisição de login
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;


    const resposta = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();
    const perfil = dados.perfil;

    if (resposta.status == 200) {
      localStorage.setItem("usuarioLogado", JSON.stringify(dados));

      window.location.href = "/home";
    } else {
      window.location.href = "/login";
    }
  });
}












//================================== HOME.HTML ==============================
let detalhePoliticaId = null

if (document.body.id == "home") {
  const btnLogout = document.getElementById("btnLogout");

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  });

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const navbar = document.querySelector("nav.header-nav");
  const btnArea = document.getElementById("btn-area");
  const btnNomePerfil = document.getElementById("btn-nome-perfil");

  const areaText =
    usuarioLogado.perfil == "admin" ? "Painel Admin" : "Minha Area";
  const nomeText = usuarioLogado ? usuarioLogado.nome : "User";

  btnArea.textContent = areaText;
  btnNomePerfil.textContent = nomeText;

  btnArea.addEventListener("click", () => {
    if (usuarioLogado.perfil == "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/cidadao";
    }
})

const politicasSection = document.getElementById("politicas-section")

carregarPoliticas()

async function carregarPoliticas() {
    try{

        const resposta = await fetch(`/${usuarioLogado.perfil}/listar`, {
            method: "GET"
        })

      const dados = await resposta.json();

      politicasSection.innerHTML = "";

      dados.forEach((politica) => {
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
            `;

        politicasSection.innerHTML += article;
      });
    } catch (error) {
      console.error("Erro ao carregar politicas", error);
    }
  }

  function detalhePolitica(idPolitica) {
    window.location.href = `/politicas?id=${idPolitica}`;
  }
}

















//================================ CIDADAO.HTML ====================================
if (document.body.id == "cidadao") {
  const btnLogout = document.getElementById("btnLogout");

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  });

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const navbar = document.querySelector("nav.header-nav");
  const btnArea = document.getElementById("btn-area");
  const btnNomePerfil = document.getElementById("btn-nome-perfil");

  const areaText =
    usuarioLogado.perfil == "admin" ? "Painel Admin" : "Minha Area";
  const nomeText = usuarioLogado ? usuarioLogado.nome : "User";
  const welcomeName = (document.getElementById("welcome-name").textContent =
    "Olá, " + usuarioLogado.nome);

  btnArea.textContent = areaText;
  btnNomePerfil.textContent = nomeText;

  btnArea.addEventListener("click", () => {
    if (usuarioLogado.perfil == "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/cidadao";
    }
  });

carregarSolicitacoes()

async function carregarSolicitacoes() {
    try{

        const resposta = await fetch(`/cidadao/${usuarioLogado.id}/solicitacoes`, {
            method: "GET"
        })

        const dados = await resposta.json()

        const sectionSolicitaces = document.getElementById("solicitacoes-section")

        sectionSolicitaces.innerHTML = ``

        dados.forEach(solicitacao => {

            const linhaTabela = `
                <div class="request-item">

                    <div class="request-header">

                        <div>

                            <h3>
                                ${solicitacao.politica}
                            </h3>

                            <p class="request-date">
                                Solicitado em ${formatarData(solicitacao.data_solicitacao)} • Atualizado em ${formatarData(solicitacao.data_atualizacao)}
                            </p>

                        </div>

                        <span class="status-badge status-analysis">
                            ${solicitacao.status_atual}
                        </span>

                    </div>

                    <div class="next-step">

                        <strong>Próximo passo:</strong>

                        Aguardando análise da documentação

                    </div>

                    <a class="details-link">
                        Ver detalhes
                    </a>

                </div>
            `

            sectionSolicitaces.innerHTML += linhaTabela
        })

    }catch(error){
        console.error("Erro ao carregar politicas", error)
    }
  }
}
















//================================ ADMIN.HTML ====================================
if (document.body.id == "admin") {
  const btnLogout = document.getElementById("btnLogout");

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  });

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const navbar = document.querySelector("nav.header-nav");
  const btnArea = document.getElementById("btn-area");
  const btnNomePerfil = document.getElementById("btn-nome-perfil");

  const areaText =
    usuarioLogado.perfil == "admin" ? "Painel Admin" : "Minha Area";
  const nomeText = usuarioLogado ? usuarioLogado.nome : "User";

  btnArea.textContent = areaText;
  btnNomePerfil.textContent = nomeText;

  btnArea.addEventListener("click", () => {
    if (usuarioLogado.perfil == "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/cidadao";
    }
  });

  const btnHome = document.getElementById("btn-home");

  btnHome.addEventListener("click", () => {
    window.location.href = "/home";
  });

  const bodyTabela = document.getElementById("bodyTabela");

  let politicasCache = [];

  carregarPoliticas();

  async function carregarPoliticas() {
    try {
      const resposta = await fetch(`/admin/listar`, {
        method: "GET",
      });

      const dados = await resposta.json();
      politicasCache = dados || [];

      bodyTabela.innerHTML = "";

      politicasCache.forEach((politica) => {
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
            `;

        bodyTabela.innerHTML += linhaTabela;
      });
    } catch (error) {
      console.error("Erro ao carregar politicas", error);
    }
  }

  const btnVaiCadastrar = document.getElementById("btnVaiCadastrar");
  const btnEnviarForm = document.getElementById("btnEnviarForm");
  const btnCancelarCadastro = document.getElementById("btnCancelarCadastro");
  const adminForm = document.getElementById("admin-form");

  const titulo = document.getElementById("form-titulo");
  const descricao = document.getElementById("form-descricao");
  const publico = document.getElementById("form-publico");
  const local = document.getElementById("form-local");
  let idEdicao = null;

  adminForm.style.display = "none";

  btnCancelarCadastro.addEventListener("click", () => {
    adminForm.style.display = "none";
  });

  btnVaiCadastrar.addEventListener("click", async function cadastrarPolitica() {
    adminForm.style.display = "flex";
    btnEnviarForm.textContent = "Cadastrar";
    idEdicao = null;
  });

  function abrirEdicao(id) {
    adminForm.style.display = "flex";
    btnEnviarForm.textContent = "Editar";

    const politica = politicasCache.find((item) => item.id == id);

    titulo.value = politica.titulo;
    descricao.value = politica.descricao;
    publico.value = politica.publico_alvo;
    local.value = politica.local_atuacao;

    idEdicao = id;
  }

  btnEnviarForm.addEventListener("click", async (event) => {
    event.preventDefault();

    const dadosFormulario = {
      titulo: titulo.value,
      descricao: descricao.value,
      publico_alvo: publico.value,
      local_atuacao: local.value,
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
            const acao = idEdicao ? "editada" : "cadastrada";
            alert(`Política ${acao} com sucesso!`);
            
            adminForm.style.display = "none"; 
            adminForm.reset(); 
            idEdicao = null; // Reseta a variável de controle
            
            carregarPoliticas()
        } else {
            console.error("O servidor respondeu com erro:", resposta.status);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }


})

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
                const acao = idEdicao ? "editada" : "cadastrada";
                alert(`Política ${acao} com sucesso!`);
                
                adminForm.style.display = "none"; 
                adminForm.reset(); 
                idEdicao = null; // Reseta a variável de controle
                
                carregarPoliticas()
            } else {
                console.error("O servidor respondeu com erro:", resposta.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
        
    })

async function deletarPolitica(id) {
    const confirmar = confirm("Tem certeza que deseja excluir esta política pública?")

    if (!confirmar) {return}

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosFormulario),
      });

      if (resposta.ok) {
        const acao = idEdicao ? "editada" : "cadastrada";
        alert(`Política ${acao} com sucesso!`);

        adminForm.style.display = "none";
        adminForm.reset();
        idEdicao = null; // Reseta a variável de controle

        carregarPoliticas();
      } else {
        console.error("O servidor respondeu com erro:", resposta.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  async function deletarPolitica(id) {
    const confirmar = confirm(
      "Tem certeza que deseja excluir esta política pública?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`/admin/deletar/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert(dados.mensagem || "Política excluída com sucesso");
        carregarPoliticas();
      } else {
        alert(dados.erro || "Erro ao excluir política pública");
      }
    } catch (error) {
      console.error("Erro ao excluir política:", error);
      alert("Erro ao tentar excluir política pública");
    }
  }
}












//================================ POLITICAS.HTML =========================


if(document.body.id == "politicas"){

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

const backBtn = document.getElementById("back-button")

backBtn.addEventListener("click", () => {
    window.location.href = "/home"
})

carregarDetalhesPolitica()

async function carregarDetalhesPolitica() {
    const urlParams = new URLSearchParams(window.location.search);
    const politicaId = Number(urlParams.get("id"));

    if (!politicaId) {
      window.location.href = "/home";
      return;
    }

    try {
        const resposta = await fetch("/cidadao/listar");
        if (!resposta.ok) throw new Error("Erro ao buscar a lista de políticas.");
        
        const dados = await resposta.json(); 
        const politica = dados.find((item) => item.id == politicaId);

        const conferePolitica = await fetch(`/cidadao/${usuarioLogado.id}/solicitacoes`, {
            method: "GET"
        })
        const politicaMarcada = await conferePolitica.json()

        if (politica) {
            document.querySelector(".policy-title").textContent = politica.titulo;
            document.querySelector(".main-content .content-card:nth-child(1) p").textContent = politica.descricao;
            document.querySelector(".sidebar .info-item:nth-child(2) p").textContent = politica.publico_alvo;
            document.querySelector(".sidebar .info-item:nth-child(3) p").textContent = politica.local_atuacao;

            configurarBotaoInteresse(politicaMarcada, politicaId, usuarioLogado);
        } else {
            console.error("Política não encontrada dentro do array.");
            alert("Política pública não encontrada.");
            window.location.href = "/home";
        }

    } catch (error) {
      console.error("Erro ao renderizar dados da política:", error);
    }
}


function configurarBotaoInteresse(politicaMarcada, politicaId, usuarioLogado) {
    const botaoInteresse = document.getElementById("enviarInteresse");
    const politicasMain = document.getElementById("politicas-main")
    
    if (!botaoInteresse) return;


    const jaManifestou = politicaMarcada.some(
        solicitacao => solicitacao.id_politica == politicaId
    );

    if (jaManifestou) {
        botaoInteresse.style.backgroundColor = "#28a745";
        botaoInteresse.textContent = "Interesse Manifestado!";
        botaoInteresse.disabled = true;
        return; // não deixa adicionar outro evento
    }
    

    botaoInteresse.addEventListener("click", async () => {
        
        try {

            botaoInteresse.disabled = true;
            botaoInteresse.textContent = "Processando...";

            
           const resposta = await fetch(`/cidadao/${usuarioLogado.id}/solicitacoes`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        id_politica: politicaId   
                    })
                });

            const resultado = await resposta.json();

        

            if (resposta.ok) {
                botaoInteresse.style.backgroundColor = "#28a745"; 
                botaoInteresse.textContent = "Interesse Manifestado!";
                
                alert("Interesse registrado com sucesso! Redirecionando para a sua área...");

            
                window.location.href = "/cidadao";
            } else {
                
                alert(resultado.message || resultado.erro || "Erro ao registrar interesse.");

                botaoInteresse.disabled = false;
                botaoInteresse.textContent = "Manifestar Interesse";

                window.location = "/home"
            }

        } catch (error) {
            console.error("Erro ao salvar solicitação:", error);
            botaoInteresse.disabled = false;
            botaoInteresse.textContent = "Manifestar Interesse";
        }


    });
  }
}

// PAGINA POLITICAS
if (document.body.id === "politicas") {
  const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado")
  );

  const btnLogout = document.querySelector(".logout-button");
  const navPoliticaButton = document.querySelector(".nav-button");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "/";
    });
  }

  if (navPoliticaButton && usuarioLogado) {
    navPoliticaButton.textContent =
      usuarioLogado.perfil === "admin"
        ? "Painel Admin"
        : "Painel Cidadão";
  }

}