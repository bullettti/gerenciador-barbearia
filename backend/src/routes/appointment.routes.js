const express = require("express");
const pool = require("../database/connection");

const router = express.Router();

router.get("/appointments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM appointments");

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar agendamentos.",
    });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    const { client_name, barber_name, appointment_date, appointment_time } =
      req.body;

    if (
      !client_name ||
      !barber_name ||
      !appointment_date ||
      !appointment_time
    ) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios.",
      });
    }

    const result = await pool.query(
      `INSERT INTO appointments 
      (client_name, barber_name, appointment_date, appointment_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [client_name, barber_name, appointment_date, appointment_time],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar agendamento.",
    });
  }
});

module.exports = router;
