const { getConnection } = require("../db/connection");
const oracledb = require("oracledb");

// Agregar un producto o combo a un pedido
async function agregarDetallePedido(req, res) {
  const { pedido_id, productoid, menuid, cantidad, precio } = req.body;
  console.log(req.body)
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_I_DETALLE_PEDIDO(:pedido_id, :productoid, :menuid, :cantidad, :precio); END;`,
      { pedido_id, productoid, menuid, cantidad, precio }
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
    const metaData = resultSet.metaData.map(col => col.name.toLowerCase());
    await resultSet.close(); // Cierra el cursor

    const formattedRows = rows.map(row =>
      Object.fromEntries(row.map((value, index) => [metaData[index], value]))
    );

    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Actualizar estado de un pedido en cocina
async function actualizarEstadoPedido(req, res) {
  console.log(req.body)
  const { detallePedidoId, estado } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_U_ESTADO_PEDIDO(:detallePedidoId, :estado); END;`,
      { detallePedidoId: detallePedidoId, estado: estado}
    );
    await connection.commit();
    res.status(200).json({ message: "Estado de pedido actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Obtener todos los productos
async function getProductos(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_PRODUCTO(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    const metaData = resultSet.metaData.map(col => col.name.toLowerCase());
    await resultSet.close();

    const formattedRows = rows.map(row =>
      Object.fromEntries(row.map((value, index) => [metaData[index], value]))
    );

    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Obtener todos los menús
async function getMenus(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_MENU(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    const metaData = resultSet.metaData.map(col => col.name.toLowerCase());
    await resultSet.close();

    const formattedRows = rows.map(row =>
      Object.fromEntries(row.map((value, index) => [metaData[index], value]))
    );

    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Obtener productos de un menú específico
async function getProductosMenu(req, res) {
  const { menuId } = req.params;
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_MENU_PRODUCTO(:menuId, :cursor); END;`,
      {
        menuId: parseInt(menuId),
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    const metaData = resultSet.metaData.map(col => col.name.toLowerCase());
    await resultSet.close();

    const formattedRows = rows.map(row =>
      Object.fromEntries(row.map((value, index) => [metaData[index], value]))
    );

    res.json(formattedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

  // Crear pedidos
  async function crearPedido(req, res) {
    const { mesaId, empleadoId } = req.body;
    let connection;
  
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN RESTAURANTE.SP_I_PEDIDO(:mesaId, :empleadoId, :cursor); END;`,
        {
          mesaId,
          empleadoId,
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        }
      );
  
      const resultSet = result.outBinds.cursor;
      const rows = await resultSet.getRows(); // Obtener las filas del cursor
      const metaData = resultSet.metaData.map(col => col.name.toLowerCase()); // Obtener nombres de columnas en minúsculas
      await resultSet.close();
      await connection.commit();
  
      // Mapear los resultados al formato de la interfaz Pedido
      const pedidos = rows.map(row =>
        Object.fromEntries(row.map((value, index) => [metaData[index], value]))
      );
  
      res.status(201).json(pedidos.length > 0 ? pedidos[0] : null); // Enviar el primer pedido creado
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (connection) await connection.close();
    }
  }
  


module.exports = { agregarDetallePedido, getPedidosCocina, actualizarEstadoPedido, getProductos, getMenus, getProductosMenu, crearPedido };
