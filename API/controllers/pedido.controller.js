const { getConnection } = require("../db/connection"); // Asegúrate de importar la conexión a Oracle
const oracledb = require("oracledb");

// Agregar un producto o combo a un pedido
async function agregarDetallePedido(req, res) {
  const { pedidoId, productoId, menuId, cantidad, precio } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_I_DETALLE_PEDIDO(:pedidoId, :productoId, :menuId, :cantidad, :precio); END;`,
      { pedidoId, productoId, menuId, cantidad, precio }
    );
    await connection.commit();
    res.status(201).json({ message: "Producto/Combo agregado al pedido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Obtener pedidos en preparación
async function getPedidosCocina(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_PEDIDO_COCINA(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows(); // Obtiene todas las filas del cursor
    await resultSet.close(); // Cierra el cursor

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Actualizar estado de un pedido en cocina
async function actualizarEstadoPedido(req, res) {
  const { detallePedidoId, estado } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_U_ESTADO_PEDIDO(:detallePedidoId, :estado); END;`,
      { detallePedidoId, estado }
    );
    await connection.commit();
    res.status(200).json({ message: "Estado de pedido actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { agregarDetallePedido, getPedidosCocina, actualizarEstadoPedido };
