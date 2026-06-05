# Documentação de Backend — Plataforma de Saúde Mental

Este arquivo é o guia completo para quem vai desenvolver o backend da plataforma. Cobre os contratos de API esperados pelo frontend, os modelos de dados, o schema do banco, autenticação, seeds iniciais e como ligar o frontend ao backend quando estiver pronto.

---

## Visão Geral

O frontend consome uma API REST com prefixo `/api`. Todos os endpoints retornam JSON. A autenticação é feita via token JWT enviado no header `Authorization: Bearer <token>`.

**URL base configurada no frontend:** `VITE_API_BASE_URL` no arquivo `.env` (padrão: `http://localhost:3000/api`)

---

## Autenticação

### POST `/api/auth/register`

Registra um novo cidadão.

**Body:**
```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "password": "senha123"
}
```

**Resposta 201:**
```json
{
  "token": "<jwt>",
  "user": {
    "id": "<uuid>",
    "name": "João da Silva",
    "email": "joao@email.com",
    "cpf": "123.456.789-00",
    "role": "citizen"
  }
}
```

**Validações:**
- `name`: mínimo 3 caracteres
- `email`: formato válido, único no banco
- `cpf`: formato `000.000.000-00`, único no banco
- `password`: mínimo 6 caracteres

---

### POST `/api/auth/login`

Autentica um usuário (cidadão ou administrador).

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123",
  "role": "citizen"
}
```

> O campo `role` é enviado pelo frontend para identificar qual tipo de usuário está tentando entrar. O backend deve validar que o `role` enviado bate com o `role` do usuário no banco — se não bater, retornar 401.

**Resposta 200:**
```json
{
  "token": "<jwt>",
  "user": {
    "id": "<uuid>",
    "name": "João da Silva",
    "email": "joao@email.com",
    "cpf": "123.456.789-00",
    "role": "citizen"
  }
}
```

**Resposta 401:**
```json
{ "error": "Credenciais inválidas" }
```

---

## Políticas Públicas

### GET `/api/policies` — público

Retorna todas as políticas, com filtros opcionais via query string.

**Query params (todos opcionais):**
- `category` — `"Saúde"` ou `"Assistência Social"`
- `region` — string de região
- `search` — busca por termo em `title`, `short_description` ou `target_audience`

**Resposta 200:**
```json
[
  {
    "id": "<uuid>",
    "title": "CAPS - Centro de Atenção Psicossocial",
    "category": "Saúde",
    "shortDescription": "Atendimento integral em saúde mental com equipe multidisciplinar.",
    "objective": "Oferecer atendimento diário a pessoas com transtornos mentais graves...",
    "targetAudience": "Pessoas com transtornos mentais graves, dependência química e suas famílias",
    "region": "Todo o território nacional",
    "requiredDocuments": ["Documento de identidade (RG ou CNH)", "CPF", "Cartão do SUS"],
    "criteria": ["Residir no Brasil", "Apresentar quadro de transtorno mental..."],
    "deadlines": "Atendimento contínuo - inscrições abertas durante todo o ano",
    "responsibleOrganization": "Ministério da Saúde / Secretarias Municipais de Saúde"
  }
]
```

> Atenção ao formato dos nomes dos campos: o frontend usa **camelCase** (`shortDescription`, `targetAudience`, etc.). Se o banco usar snake_case, faça a conversão na camada de resposta.

---

### GET `/api/policies/:id` — público

Retorna os detalhes de uma política específica.

**Resposta 200:** mesmo objeto do item acima (objeto único, não array)

**Resposta 404:**
```json
{ "error": "Política não encontrada" }
```

---

### POST `/api/policies` — admin

Cria uma nova política.

**Header:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "title": "Nome da Política",
  "category": "Saúde",
  "shortDescription": "Descrição curta.",
  "objective": "Objetivo detalhado.",
  "targetAudience": "Público-alvo.",
  "region": "Todo o território nacional",
  "requiredDocuments": ["RG", "CPF"],
  "criteria": ["Critério 1", "Critério 2"],
  "deadlines": "Prazo de inscrição.",
  "responsibleOrganization": "Órgão responsável"
}
```

Todos os campos são obrigatórios. `requiredDocuments` e `criteria` devem ter pelo menos 1 item.

**Resposta 201:** objeto da política criada (com `id` gerado)

**Resposta 403:**
```json
{ "error": "Acesso negado - apenas administradores" }
```

---

### PUT `/api/policies/:id` — admin

Atualiza uma política existente. Aceita atualização parcial (apenas os campos enviados são alterados).

**Header:** `Authorization: Bearer <admin-token>`

**Body (todos os campos são opcionais):**
```json
{
  "title": "Novo título",
  "shortDescription": "Nova descrição."
}
```

**Resposta 200:** objeto completo da política atualizada

**Resposta 404:**
```json
{ "error": "Política não encontrada" }
```

---

### DELETE `/api/policies/:id` — admin

Remove uma política.

**Header:** `Authorization: Bearer <admin-token>`

**Resposta 204:** sem corpo

**Resposta 404:**
```json
{ "error": "Política não encontrada" }
```

---

## Solicitações (Applications)

### POST `/api/applications` — cidadão autenticado

Registra a manifestação de interesse de um cidadão em uma política.

**Header:** `Authorization: Bearer <citizen-token>`

**Body:**
```json
{
  "policyId": "<uuid>",
  "citizenId": "<uuid>"
}
```

O backend deve validar que o `citizenId` do body corresponde ao `userId` dentro do token JWT — para garantir que o cidadão só pode criar solicitações em seu próprio nome.

**Resposta 201:**
```json
{
  "id": "<uuid>",
  "policyId": "<uuid>",
  "policyTitle": "CAPS - Centro de Atenção Psicossocial",
  "citizenId": "<uuid>",
  "citizenName": "João da Silva",
  "applicationDate": "2026-05-18T10:30:00Z",
  "status": "Em análise",
  "lastUpdate": "2026-05-18T10:30:00Z",
  "nextStep": "Aguardando análise da documentação"
}
```

**Resposta 400** (solicitação duplicada):
```json
{ "error": "Você já possui uma solicitação para esta política" }
```

---

### GET `/api/citizens/:citizenId/applications` — cidadão autenticado

Retorna todas as solicitações do cidadão.

**Header:** `Authorization: Bearer <citizen-token>`

O `citizenId` na URL deve bater com o `userId` no token. Se não bater, retornar 403.

**Resposta 200:** array de objetos `Application` (mesmo formato do POST acima). Retornar array vazio `[]` se não houver solicitações.

**Resposta 403:**
```json
{ "error": "Acesso negado - você só pode ver suas próprias solicitações" }
```

---

### GET `/api/admin/applications` — admin

Retorna todas as solicitações do sistema.

**Header:** `Authorization: Bearer <admin-token>`

**Resposta 200:** array de objetos `Application` de todos os cidadãos.

---

## Estatísticas (Admin)

### GET `/api/admin/stats` — admin

Retorna dados agregados para o painel administrativo.

**Header:** `Authorization: Bearer <admin-token>`

**Resposta 200:**
```json
{
  "applications": {
    "total": 755,
    "approved": 320,
    "inAnalysis": 245,
    "waitingDocument": 120,
    "inProgress": 70
  },
  "policiesStats": [
    {
      "policyId": "<uuid>",
      "policyTitle": "CAPS - Centro de Atenção Psicossocial",
      "applicationsCount": 245
    }
  ],
  "statusDistribution": [
    { "status": "Aprovado", "count": 320 },
    { "status": "Em análise", "count": 245 },
    { "status": "Aguardando Documento", "count": 120 },
    { "status": "Em atendimento", "count": 70 }
  ]
}
```

**Como calcular cada campo:**
- `applications.total` → `COUNT(*)` em applications
- `applications.approved` → `COUNT(*)` WHERE `status = 'Aprovado'`
- `applications.inAnalysis` → WHERE `status = 'Em análise'`
- `applications.waitingDocument` → WHERE `status = 'Aguardando Documento'`
- `applications.inProgress` → WHERE `status = 'Em atendimento'`
- `policiesStats` → `GROUP BY policy_id`, contando applications por política
- `statusDistribution` → `GROUP BY status`, contando applications por status

---

## Modelos de Dados

### User
```typescript
{
  id: string;           // UUID v4
  name: string;         // Nome completo
  email: string;        // Único
  password: string;     // Hash bcrypt — nunca retornar em respostas de API
  cpf?: string;         // Apenas para role "citizen", único
  role: "citizen" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
```

### Policy
```typescript
{
  id: string;
  title: string;
  category: "Saúde" | "Assistência Social";
  shortDescription: string;
  objective: string;
  targetAudience: string;
  region: string;
  requiredDocuments: string[];   // array JSON
  criteria: string[];            // array JSON
  deadlines: string;
  responsibleOrganization: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Application
```typescript
{
  id: string;
  policyId: string;    // FK → Policy
  citizenId: string;   // FK → User
  applicationDate: Date;
  status: "Em análise" | "Aprovado" | "Aguardando Documento" | "Em atendimento" | "Concluído";
  lastUpdate: Date;
  nextStep?: string;   // campo opcional
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Schema SQL (PostgreSQL)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);

-- -------------------------------------------------------

CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Saúde', 'Assistência Social')),
  short_description TEXT NOT NULL,
  objective TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  region VARCHAR(255) NOT NULL,
  required_documents JSONB NOT NULL,
  criteria JSONB NOT NULL,
  deadlines TEXT NOT NULL,
  responsible_organization VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_policies_category ON policies(category);

-- -------------------------------------------------------

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_date TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'Em análise' CHECK (status IN (
    'Em análise', 'Aprovado', 'Aguardando Documento', 'Em atendimento', 'Concluído'
  )),
  last_update TIMESTAMP NOT NULL DEFAULT NOW(),
  next_step TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (policy_id, citizen_id)
);

CREATE INDEX idx_applications_citizen ON applications(citizen_id);
CREATE INDEX idx_applications_policy ON applications(policy_id);
CREATE INDEX idx_applications_status ON applications(status);
```

> Se preferir MongoDB, os campos com array (`required_documents`, `criteria`) são nativos. O campo `status` pode ser um `enum`. A lógica de negócio é a mesma.

---

## Autenticação JWT

### Configuração do middleware

```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = decoded; // { userId, email, role }
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado - apenas administradores' });
  }
  next();
}

function requireCitizen(req, res, next) {
  if (!req.user || req.user.role !== 'citizen') {
    return res.status(403).json({ error: 'Acesso negado - apenas cidadãos' });
  }
  next();
}
```

### Payload do token

```json
{
  "userId": "<uuid>",
  "email": "usuario@email.com",
  "role": "citizen",
  "iat": 1234567890,
  "exp": 1234567890
}
```

O frontend lê o `userId` e `role` diretamente do objeto `user` retornado pelo login — não do token em si. O token é armazenado em `localStorage` com a chave `authToken` e o objeto `user` com a chave `authUser`.

### Gerando o token no login/registro

```javascript
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

## CORS

O frontend roda em `http://localhost:5173` por padrão. Configure o CORS no backend:

**Node.js / Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Python / Flask:**
```python
from flask_cors import CORS

CORS(app, resources={
  r"/api/*": {
    "origins": "http://localhost:5173",
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allow_headers": ["Content-Type", "Authorization"]
  }
})
```

---

## Formato de Erros

O frontend espera erros no seguinte formato:

```json
{
  "error": "Mensagem descritiva do erro",
  "details": {
    "field": "email",
    "message": "Email já está em uso"
  }
}
```

O campo `details` é opcional e útil para erros de validação. O campo `error` é obrigatório em toda resposta de erro.

**Códigos de status esperados:**

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 204 | Sucesso sem corpo (DELETE) |
| 400 | Erro de validação / requisição inválida |
| 401 | Não autenticado (token ausente ou inválido) |
| 403 | Sem permissão (token válido, mas role incorreto) |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

## Seeds Iniciais

Execute no banco antes de testar o frontend.

### Usuário admin
```sql
INSERT INTO users (name, email, password, role)
VALUES (
  'Administrador do Sistema',
  'admin@saude.gov.br',
  '$2b$10$HASH_BCRYPT_DE_admin123',
  'admin'
);
```

### Usuário cidadão de teste
```sql
INSERT INTO users (name, email, cpf, password, role)
VALUES (
  'João da Silva',
  'joao@email.com',
  '123.456.789-00',
  '$2b$10$HASH_BCRYPT_DE_senha123',
  'citizen'
);
```

### Política de exemplo
```sql
INSERT INTO policies (
  title, category, short_description, objective, target_audience,
  region, required_documents, criteria, deadlines, responsible_organization
) VALUES (
  'CAPS - Centro de Atenção Psicossocial',
  'Saúde',
  'Atendimento integral em saúde mental com equipe multidisciplinar.',
  'Oferecer atendimento diário a pessoas com transtornos mentais graves e persistentes, promovendo a reinserção social e acompanhamento terapêutico contínuo.',
  'Pessoas com transtornos mentais graves, dependência química e suas famílias',
  'Todo o território nacional',
  '["Documento de identidade (RG ou CNH)", "CPF", "Cartão do SUS", "Comprovante de residência"]',
  '["Residir no Brasil", "Apresentar quadro de transtorno mental que demande cuidado intensivo", "Ter disponibilidade para frequentar o serviço regularmente"]',
  'Atendimento contínuo - inscrições abertas durante todo o ano',
  'Ministério da Saúde / Secretarias Municipais de Saúde'
);
```

---

## Conectando o Frontend ao Backend

Quando o backend estiver pronto, siga estes passos para ligar o frontend:

### 1. Configure o `.env`

Crie o arquivo `.env` na raiz do projeto frontend:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

Ajuste a porta e o caminho conforme onde seu backend estiver rodando.

### 2. Ative as chamadas de API em `policies.ts`

Abra `src/app/data/policies.ts`. Em cada função, há um bloco comentado com a chamada real à API e uma linha `throw new Error(...)` que a bloqueia. O padrão é:

```typescript
// Antes (bloqueado):
export async function fetchPolicies(filters?: { ... }): Promise<Policy[]> {
  // const response = await fetch(`${API_BASE_URL}/policies?${queryParams}`);
  // if (!response.ok) throw new Error('Erro ao buscar políticas');
  // return response.json();

  throw new Error('Backend não conectado - implementar endpoint GET /api/policies');
}

// Depois (ativo):
export async function fetchPolicies(filters?: { ... }): Promise<Policy[]> {
  const queryParams = new URLSearchParams(filters as any).toString();
  const response = await fetch(`${API_BASE_URL}/policies?${queryParams}`);
  if (!response.ok) throw new Error('Erro ao buscar políticas');
  return response.json();
}
```

Faça isso para todas as funções: `fetchPolicies`, `fetchPolicyById`, `createApplication`, `fetchCitizenApplications`, `fetchAllApplications`, `fetchAdminStats`, `createPolicy`, `updatePolicy`, `deletePolicy`.

### 3. Ative a autenticação em `AuthContext.tsx`

Abra `src/app/contexts/AuthContext.tsx` e faça o mesmo processo nas funções `login` e `register`: descomente o bloco da chamada à API e remova o `throw new Error`.

### 4. Remova as mensagens de erro temporárias nas páginas

Use a busca do seu editor para localizar a string `"Backend não conectado"` — ela aparece nas páginas `Home.tsx`, `PolicyDetails.tsx`, `CitizenDashboard.tsx` e `AdminPanel.tsx`. Em cada ocorrência, remova o `toast.error(...)` e descomente a linha da chamada à função de API logo abaixo.

### 5. Reinicie o servidor de desenvolvimento

```bash
npm run dev
```

---

## Checklist de Implementação do Backend

- [ ] Banco de dados criado e schema aplicado
- [ ] Seeds inseridos (admin, cidadão de teste, políticas exemplo)
- [ ] `POST /api/auth/register` implementado
- [ ] `POST /api/auth/login` implementado
- [ ] Middleware `authenticateToken` implementado
- [ ] Middlewares `requireAdmin` e `requireCitizen` implementados
- [ ] `GET /api/policies` implementado (com filtros)
- [ ] `GET /api/policies/:id` implementado
- [ ] `POST /api/policies` implementado (admin)
- [ ] `PUT /api/policies/:id` implementado (admin)
- [ ] `DELETE /api/policies/:id` implementado (admin)
- [ ] `POST /api/applications` implementado (citizen)
- [ ] `GET /api/citizens/:citizenId/applications` implementado (citizen)
- [ ] `GET /api/admin/applications` implementado (admin)
- [ ] `GET /api/admin/stats` implementado (admin)
- [ ] CORS configurado para `http://localhost:5173`
- [ ] Variável `JWT_SECRET` configurada no ambiente
- [ ] Validações de dados implementadas em todos os endpoints
- [ ] Tratamento de erros retornando o formato `{ "error": "..." }`
- [ ] Frontend conectado e funcionando end-to-end
