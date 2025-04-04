const express = require("express");
const { agregarDetallePedido, getPedidosCocina, actualizarEstadoPedido, getProductos, getMenus, getProductosMenu, crearPedido } = require("../controllers/pedido.controller");

const router = express.Router();

// Agregar un producto o combo a un pedido
router.post("/", agregarDetallePedido);

// Obtener pedidos en preparación
router.get("/", getPedidosCocina);

// Actualizar estado de un pedido en cocina
router.put("/", actualizarEstadoPedido);

// Obtener todos los productos
router.get("/productos", getProductos);

// Obtener los menus
router.get("/menus", getMenus);

// Obtener los productos de un menu en especifico
router.get("/productos-menu/:menuId", getProductosMenu);

// Crear Pedido
router.post("/pedido", crearPedido)

module.exports = router;
