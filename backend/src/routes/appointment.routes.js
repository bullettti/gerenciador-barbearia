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
module.exports = router;
