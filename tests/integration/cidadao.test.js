jest.mock("../../src/database/database");

const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/database/database");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CT-32 | GET /cidadao/:id/solicitacoes - Usuário não vê solicitações de outro", () => {

  test("deve retornar apenas as solicitações do usuário A (id=1)", async () => {

    // Simula o banco retornando solicitações só do usuário 1
    const solicitacoesUsuarioA = [
      {
        id: 10,
        id_usuario: 1,
        id_politica: 3,
        politica: "Saúde Mental",
        descricao: "Apoio psicológico",
        publico_alvo: "Jovens",
        local_atuacao: "DF",
        data_solicitacao: "2024-01-01",
        data_atualizacao: "2024-01-01",
        status_atual: "pendente"
      }
    ];

    db.query.mockResolvedValue([solicitacoesUsuarioA]);

    const res = await request(app).get("/cidadao/1/solicitacoes");

    expect(res.status).toBe(200);

    // Todas as solicitações retornadas pertencem ao usuário 1
    res.body.forEach(solicitacao => {
      expect(solicitacao.id_usuario).toBe(1);
    });
  });

  test("deve retornar lista vazia se usuário B (id=2) não tiver solicitações", async () => {

    db.query.mockResolvedValue([[]]); // banco retorna vazio para o usuário 2

    const res = await request(app).get("/cidadao/2/solicitacoes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("não deve retornar solicitações do usuário B ao consultar usuário A", async () => {

    const solicitacoesUsuarioA = [{ id: 10, id_usuario: 1 }];
    const solicitacoesUsuarioB = [{ id: 99, id_usuario: 2 }];

    // Primeira chamada → usuário A, segunda → usuário B
    db.query
      .mockResolvedValueOnce([solicitacoesUsuarioA])
      .mockResolvedValueOnce([solicitacoesUsuarioB]);

    const resA = await request(app).get("/cidadao/1/solicitacoes");
    const resB = await request(app).get("/cidadao/2/solicitacoes");

    // Garante que os resultados são diferentes entre si
    const idsA = resA.body.map(s => s.id_usuario);
    const idsB = resB.body.map(s => s.id_usuario);

    expect(idsA).not.toEqual(expect.arrayContaining(idsB));
  });
});

// CT-10 | GET /cidadao/listar - Listar todas as políticas públicas
describe("CT-10 | GET /cidadao/listar - Listar todas as políticas públicas", () => {

  test("deve retornar 200 com array de políticas", async () => {

    const politicasFake = [
      {
        id: 1,
        titulo: "Saúde Mental",
        descricao: "Apoio psicológico",
        publico_alvo: "Jovens",
        local_atuacao: "DF"
      },
      {
        id: 2,
        titulo: "Habitação Popular",
        descricao: "Acesso à moradia",
        publico_alvo: "Famílias de baixa renda",
        local_atuacao: "Nacional"
      }
    ];

    db.query.mockResolvedValue([politicasFake]);

    const res = await request(app).get("/cidadao/listar");

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);

    // Cada item deve conter os campos esperados
    res.body.forEach(politica => {
      expect(politica).toHaveProperty("id");
      expect(politica).toHaveProperty("titulo");
      expect(politica).toHaveProperty("descricao");
      expect(politica).toHaveProperty("publico_alvo");
      expect(politica).toHaveProperty("local_atuacao");
    });
  });

  test("deve retornar 404 quando não há políticas cadastradas", async () => {

    db.query.mockResolvedValue([[]]);

    const res = await request(app).get("/cidadao/listar");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("erro");
  });
});

// CT-26 | POST /cidadao/:id/solicitacoes - Registrar interesse em política
describe("CT-26 | POST /cidadao/:id/solicitacoes - Registrar interesse em política", () => {

  test("deve retornar 201 ao registrar interesse com sucesso", async () => {

    // Primeira query: verifica duplicata → nenhuma encontrada
    // Segunda query: INSERT → retorna insertId
    db.query
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 5 }]);

    const res = await request(app)
      .post("/cidadao/1/solicitacoes")
      .send({ id_politica: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Solicitacao registrada com sucesso");
    expect(res.body).toHaveProperty("id_solicitacao", 5);
  });
});

// CT duplicata | POST /cidadao/:id/solicitacoes - Interesse duplicado
describe("CT-27 | POST /cidadao/:id/solicitacoes - Registrar interesse duplicado", () => {

  test("deve retornar 400 quando usuário já registrou interesse na mesma política", async () => {

    // Simula que já existe uma solicitação para esse usuário + política
    db.query.mockResolvedValueOnce([[{ id: 99, id_usuario: 1, id_politica: 1 }]]);

    const res = await request(app)
      .post("/cidadao/1/solicitacoes")
      .send({ id_politica: 1 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro", "Você já demonstrou interesse nessa política pública");
  });
});