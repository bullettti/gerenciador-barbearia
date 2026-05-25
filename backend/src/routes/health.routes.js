const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API da Barbearia funcionando com nodemon!",
  });
});
module.exports = router;
