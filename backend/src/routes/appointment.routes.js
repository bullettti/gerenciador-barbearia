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

    const existingAppointment = await pool.query(
      `SELECT * FROM appointments
   WHERE barber_name = $1
   AND appointment_date = $2
   AND appointment_time = $3
   AND status = 'scheduled'`,
      [barber_name, appointment_date, appointment_time],
    );

    if (existingAppointment.rows.length > 0) {
      return res.status(409).json({
        message: "Este horário já está ocupado para este barbeiro.",
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

router.patch("/appointments/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Agendamento não encontrado.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cancelar agendamento.",
    });
  }
});

router.get("/appointments/available-times", async (req, res) => {
  try {
    const { barber_name, appointment_date } = req.query;

    if (!barber_name || !appointment_date) {
      return res.status(400).json({
        message: "Informe o barbeiro e a data.",
      });
    }

    const allTimes = [
      "09:00:00",
      "10:00:00",
      "11:00:00",
      "12:00:00",
      "14:00:00",
      "15:00:00",
      "16:00:00",
      "17:00:00",
    ];

    const result = await pool.query(
      `SELECT appointment_time FROM appointments
       WHERE barber_name = $1
       AND appointment_date = $2
       AND status = 'scheduled'`,
      [barber_name, appointment_date],
    );

    const occupiedTimes = result.rows.map(
      (appointment) => appointment.appointment_time,
    );

    const availableTimes = allTimes.filter((time) => {
      return !occupiedTimes.includes(time);
    });

    res.json({
      barber_name,
      appointment_date,
      available_times: availableTimes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar horários disponíveis.",
    });
  }
});

module.exports = router;
