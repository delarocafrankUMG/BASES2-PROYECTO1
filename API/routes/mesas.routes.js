const express = require("express");
const { getMesas, insertMesa, updateMesaEstado, getPedidosPorMesa } = require("../controllers/mesas.controller");

const router = express.Router();

router.get("/", getMesas);
router.post("/", insertMesa);
router.put("/:id", updateMesaEstado);
router.get("/pedidos/:mesaId", getPedidosPorMesa)

module.exports = router;