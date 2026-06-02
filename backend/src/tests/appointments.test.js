const request = require("supertest");
const app = require("../app");
const pool = require("../database/connection");

describe("POST /appointments", () => {
  it("deve retornar 400 quando faltar campos obrigatórios", async () => {
    const response = await request(app).post("/appointments").send({
      barber_name: "Carlos",
      appointment_date: "2026-05-28",
      appointment_time: "11:00",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Preencha todos os campos obrigatórios.",
    );
  });

  it("deve retornar 409 quando o horário já estiver ocupado", async () => {
    const response = await request(app).post("/appointments").send({
      client_name: "Teste Conflito",
      barber_name: "Carlos",
      appointment_date: "2026-05-28",
      appointment_time: "11:00",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      "Este horário já está ocupado para este barbeiro.",
    );
  });
});
