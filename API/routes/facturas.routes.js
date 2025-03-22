const express = require("express");
const { generarFactura, getFacturas } = require("../controllers/facturas.controller");

const router = express.Router();

// Ruta para generar una factura
router.post("/", generarFactura);

// Ruta para obtener todas las facturas
router.get("/", getFacturas);

module.exports = router;
