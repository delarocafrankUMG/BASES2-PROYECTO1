const express = require("express");
const { abrirCaja, cerrarCaja, getCajas } = require("../controllers/cajas.controller");

const router = express.Router();

router.post("/", abrirCaja);
router.put("/:id", cerrarCaja);
router.get("/", getCajas)
module.exports = router;