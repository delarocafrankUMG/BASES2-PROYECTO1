const express = require("express");
const { agregarDetallePedido, getPedidosCocina, actualizarEstadoPedido } = require("../controllers/pedido.controller");

const router = express.Router();

// Agregar un producto o combo a un pedido
router.post("/", agregarDetallePedido);

// Obtener pedidos en preparación
router.get("/", getPedidosCocina);

// Actualizar estado de un pedido en cocina
router.put("/", actualizarEstadoPedido);

module.exports = router;
