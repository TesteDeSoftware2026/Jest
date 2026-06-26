// tests/integration/admin.test.js

jest.mock("../../src/database/database");

const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/database/database");

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── POST /api/admin/criar ────────────────────────────────────
describe("POST /admin/criar", () => {
  test("CT-XX | deve criar política e retornar 201", async () => {
    db.query.mockResolvedValue([{ insertId: 1 }]);

    const res = await request(app)
      .post("/admin/criar")
      .send({
        titulo: "Saúde Mental",
        descricao: "Apoio psicológico",
        publico_alvo: "Jovens",
        local_atuacao: "DF",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 1);
  });

  test("deve retornar 400 se campos obrigatórios faltarem", async () => {
    const res = await request(app)
      .post("/admin/criar")
      .send({ titulo: "Só o título" }); // faltam campos

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro");
  });
});

// ─── GET /admin/listar ────────────────────────────────────
describe("GET /admin/listar", () => {
  test("CT-41 | deve retornar 200 com lista de políticas", async () => {
    db.query.mockResolvedValue([[{ id: 1, titulo: "Política A" }]]);

    const res = await request(app).get("/admin/listar");

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("deve retornar 404 quando não há políticas", async () => {
    db.query.mockResolvedValue([[]]);

    const res = await request(app).get("/admin/listar");

    expect(res.status).toBe(404);
  });
});

// ─── DELETE /admin/deletar/:id ───────────────────────────
describe("DELETE /admin/deletar/:id - Exclusão de política", () => {

  test("CT-42 | deve retornar 409 se houver solicitações vinculadas", async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]])  // política existe
      .mockResolvedValueOnce([[{ id: 5 }]]); // solicitação vinculada

    const res = await request(app).delete("/admin/deletar/1");

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("erro", "Não é possível excluir esta política, pois existem solicitações vinculadas a ela");
  });

  test("CT-43 | deve retornar 200 ao deletar política sem solicitações vinculadas", async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // política existe
      .mockResolvedValueOnce([[]])           // sem solicitações vinculadas
      .mockResolvedValueOnce([{}]);          // DELETE executado

    const res = await request(app).delete("/admin/deletar/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mensagem", "Política excluída com sucesso");
  });

  test("CT-44 | deve retornar 404 ao tentar deletar política inexistente", async () => {
    db.query.mockResolvedValueOnce([[]]); // política não encontrada

    const res = await request(app).delete("/admin/deletar/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("erro", "Política pública não encontrada com o ID fornecido");
  });
});

describe("CT-35 | PUT /admin/editar/:id - Admin edita política existente", () => {

  test("deve retornar 200 e confirmar atualização da política", async () => {

    // Simula o banco aceitando o UPDATE (1 linha afetada)
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const res = await request(app)
      .put("/admin/editar/1")
      .send({
        titulo: "Título Atualizado",
        descricao: "Nova descrição",
        publico_alvo: "Adultos",
        local_atuacao: "DF",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mensagem", "Política atualizada com sucesso!");
    expect(res.body.politica).toHaveProperty("titulo", "Título Atualizado");
  });

  test("deve retornar 400 se campos obrigatórios faltarem", async () => {

    const res = await request(app)
      .put("/admin/editar/1")
      .send({ titulo: "Só o título" }); // faltam descricao, publico_alvo, local_atuacao

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro");
  });

  test("deve retornar 404 se política não existir", async () => {

    // Simula UPDATE que não encontrou nenhuma linha
    db.query.mockResolvedValue([{ affectedRows: 0 }]);

    const res = await request(app)
      .put("/admin/editar/999")
      .send({
        titulo: "Título",
        descricao: "Descrição",
        publico_alvo: "Jovens",
        local_atuacao: "DF",
      });

    expect(res.status).toBe(404);
  });
});

// CT-34 | POST /admin/criar - Admin cadastra nova política pública
describe("CT-34 | POST /admin/criar - Admin cadastra nova política pública", () => {

  test("deve retornar 201 com a política criada", async () => {

    db.query.mockResolvedValue([{ insertId: 7 }]);

    const res = await request(app)
      .post("/admin/criar")
      .send({
        titulo: "Nova Política",
        descricao: "Descrição da nova política",
        publico_alvo: "Nacional",
        local_atuacao: "Nacional"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 7);
    expect(res.body).toHaveProperty("titulo", "Nova Política");
  });

  test("deve retornar 400 se algum campo obrigatório faltar", async () => {

    const res = await request(app)
      .post("/admin/criar")
      .send({
        titulo: "Nova Política"
        // faltam descricao, publico_alvo, local_atuacao
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro");
  });
});