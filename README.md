# Projeto de Teste de Software


## Requisitos

- Node.js 22+
- npm 10+

## Instalação

Clone o repositório:

```bash
# git bash
git clone https://github.com/TesteDeSoftware2026/Jest.git
```

Entre na pasta:

```bash
# git bash
cd ./Jest
code .
```

Instale as dependências:

```bash
# cmd
npm install
```

## Executar aplicação

```bash
# cmd
npm run dev
```

## Roda todos os testes
```bash
# cmd
npm test
```

## Só unitários (rápido, sem banco)
```bash
# cmd
npm run test:unit
```


## Só integração (precisa do banco rodando)
```bash
# cmd
npm run test:integration
```

## Roda um arquivo específico
```bash
# cmd
npx jest tests/unit/authService.test.js
```



--Quando usar o git clone pela primeira vez--

```
npm install
```

--BANCO DE DADOS



Tenha instalado pelo menos o servidor do mysql 8.0.46

Nome da extensão 
nome: Database Client
autor: database-client.com

Entra no icone de database em formato de cilindro, crie uma conexão com mysql
especifique o "user" e "password" sendo os mesmo usados na instalação do mysql.

-- .ENV
crie o arquivo .env na raiz do projeto 

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=*seu user*
DB_PASSWORD=*sua senha*
DB_NAME=jest_db
```

Ao fazer a conexão manual na extensão coloque o database como "web_library_db"

Depois entre no database/schema.sql, acima da linha 1 vai aparecer a opção de "active", clique e selecione o mysql e depois o database criado anteriormente.

Só assim, execute cada instrução do schema, com uma opção "run" logo acima de cada comando.




--PUXAR UPDATES E PULL REQUEST--

salva suas alteações
```
git add .
git commit -m "..."
```


