const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const appointmentRoutes = require("./routes/appointment.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo à API do Gerenciador de Agendamentos da Barbearia!",
  });
});

app.use(healthRoutes);
app.use(appointmentRoutes);

module.exports = app;
