const request = require("supertest");
const app = require("../app");
const pool = require("../database/connection");

describe("GET /", () => {
  it("deve retornar a mensagem principal da API", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Bem-vindo à API do Gerenciador de Agendamentos da Barbearia!",
    );
  });
});
