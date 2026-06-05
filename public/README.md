# Plataforma de Políticas Públicas de Saúde Mental

Plataforma digital para oferta e acompanhamento de políticas públicas de saúde mental, desenvolvida como projeto acadêmico para a disciplina de Teste e Qualidade de Software.

---

## Sobre o Projeto

Este repositório contém o **frontend** da plataforma, desenvolvido em React com TypeScript e Tailwind CSS. A aplicação está preparada para integração com um backend — os contratos de API, modelos de dados e instruções de integração estão documentados em [`BACKEND.md`](./BACKEND.md).

### Páginas implementadas

| Rota | Página | Descrição |
|---|---|---|
| `/` | Home | Listagem, busca e filtros de políticas |
| `/politica/:id` | Detalhes da Política | Informações completas e manifestação de interesse |
| `/minha-area` | Área do Cidadão | Acompanhamento de solicitações |
| `/admin` | Painel Administrativo | CRUD de políticas e relatórios |
| `/login` | Login | Autenticação de cidadãos e administradores |
| `/cadastro` | Cadastro | Registro de novos cidadãos |

---

## Instalação e Execução

**Pré-requisitos:** Node.js 18+

```bash
# Instalar dependências
npm install

# Criar o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e ajuste a URL do backend:
# VITE_API_BASE_URL=http://localhost:3000/api

# Rodar em desenvolvimento
npm run dev
```

A aplicação estará em `http://localhost:5173`.

```bash
# Build para produção
npm run build
# Arquivos gerados em dist/
```

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                  # Componentes base (shadcn/ui + Radix UI)
│   │   ├── Header.tsx           # Cabeçalho com navegação
│   │   ├── PolicyCard.tsx       # Card de política na listagem
│   │   ├── SearchBar.tsx        # Barra de busca
│   │   └── Filters.tsx          # Filtros por categoria, região e público
│   ├── contexts/
│   │   └── AuthContext.tsx      # Estado global de autenticação (JWT)
│   ├── data/
│   │   └── policies.ts          # Interfaces TypeScript + funções de chamada à API
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── PolicyDetails.tsx
│   │   ├── CitizenDashboard.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── routes.tsx               # Definição de rotas (React Router)
│   └── App.tsx                  # Componente raiz
├── styles/
│   ├── theme.css                # Variáveis de cores e tipografia (Tailwind v4)
│   └── tailwind.css             # Importação do Tailwind
└── main.tsx                     # Entry point
```

O arquivo mais relevante para a integração é `src/app/data/policies.ts`: ele contém as interfaces TypeScript de todos os modelos e as funções que fazem as chamadas à API — atualmente com o corpo comentado aguardando o backend.

---

## Tecnologias

- **React 18** + **TypeScript**
- **Tailwind CSS 4** — estilização
- **React Router 7** — roteamento
- **Vite** — build tool
- **Recharts** — gráficos no painel admin
- **Radix UI** + **shadcn/ui** — componentes acessíveis
- **Lucide React** — ícones
- **Sonner** — notificações toast

---

## Design System

**Cores principais:**
- Azul governamental: `#003DA5`
- Azul escuro (hover): `#002D7A`
- Fundo: `#F9FAFB`

**Status de solicitações:**
- Em análise: azul `#3b82f6`
- Aprovado: verde `#10b981`
- Aguardando Documento: amarelo `#f59e0b`
- Em atendimento: roxo `#8b5cf6`

---

## Informações Acadêmicas

- **Disciplina:** Teste e Qualidade de Software
- **Objetivo:** Protótipo funcional de plataforma governamental com documentação de integração
- **Tecnologias obrigatórias:** React, TypeScript, design responsivo
