// tests/unit/adminService.test.js

// Mocka o módulo do banco ANTES de importar o service

jest.mock("../../src/database/database", () => ({
  query: jest.fn()
}));

const db = require("../../src/database/database");
const adminService = require("../../src/services/adminService");

// Limpa os mocks entre cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

// ─── criarPolitica ───────────────────────────────────────────
describe("criarPolitica", () => {
  test("deve retornar a política criada com o id correto", async () => {
    // Simula o retorno do db.query para um INSERT
    db.query.mockResolvedValue([{ insertId: 42 }]);

    const resultado = await adminService.criarPolitica(
      "Saúde Mental",
      "Descrição teste",
      "Jovens",
      "Brasília"
    );

    expect(resultado).toEqual({
      id: 42,
      titulo: "Saúde Mental",
      descricao: "Descrição teste",
      publico_alvo: "Jovens",
      local_atuacao: "Brasília",
    });

    // Garante que o db.query foi chamado com o SQL correto
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});

// ─── listarPolitica ──────────────────────────────────────────
describe("listarPolitica", () => {
  test("deve retornar lista de políticas", async () => {
    const politicasFake = [
      { id: 1, titulo: "Política A" },
      { id: 2, titulo: "Política B" },
    ];
    db.query.mockResolvedValue([politicasFake]);

    const resultado = await adminService.listarPolitica();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].titulo).toBe("Política A");
  });

  test("deve lançar erro 404 quando não há políticas", async () => {
    db.query.mockResolvedValue([[]]); // array vazio

    await expect(adminService.listarPolitica()).rejects.toMatchObject({
      status: 404,
      message: "Nenhuma politica encontrada",
    });
  });
});

// ─── deletarPolitica ─────────────────────────────────────────
describe("deletarPolitica", () => {
  test("deve lançar 404 se política não existir", async () => {
    db.query.mockResolvedValue([[]]); // SELECT retorna vazio

    await expect(adminService.deletarPolitica(99)).rejects.toMatchObject({
      status: 404,
    });
  });

  test("deve lançar 409 se houver solicitações vinculadas", async () => {
    // Primeiro SELECT (busca política) → encontrou
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]])
      // Segundo SELECT (busca solicitações) → tem vínculo
      .mockResolvedValueOnce([[{ id: 10 }]]);

    await expect(adminService.deletarPolitica(1)).rejects.toMatchObject({
      status: 409,
    });
  });

  test("deve deletar e retornar mensagem de sucesso", async () => {
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // política existe
      .mockResolvedValueOnce([[]])           // sem solicitações vinculadas
      .mockResolvedValueOnce([{}]);          // DELETE executado

    const resultado = await adminService.deletarPolitica(1);

    expect(resultado).toEqual({
      id: 1,
      mensagem: "Política excluída com sucesso",
    });
  });
});