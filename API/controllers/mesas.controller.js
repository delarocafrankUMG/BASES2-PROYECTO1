const { getConnection } = require("../db/connection");
const oracledb = require("oracledb");

// Obtener todas las mesas
async function getMesas(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_MESA(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );
    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();
    const metaData = cursor.metaData.map(col => col.name.toLowerCase());
    await cursor.close();

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

// Insertar una nueva mesa
async function insertMesa(req, res) {
  const { numero, estado } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_I_MESA(:numero, :estado); END;`,
      { numero, estado }
    );
    await connection.commit();
    res.status(201).json({ message: "Mesa creada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Actualizar el estado de una mesa
async function updateMesaEstado(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    let connection;
    console.log(req)
    try {
      connection = await getConnection();
      await connection.execute(
        `BEGIN RESTAURANTE.SP_U_MESA_ESTADO(:id, :estado); END;`,
        { id, estado }
      );
      await connection.commit();
      res.json({ message: "Estado de la mesa actualizado" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      if (connection) await connection.close();
    }
  }

  // Obtener los pedidos por mesa
  async function getPedidosPorMesa(req, res) {
    const { mesaId } = req.params;
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN RESTAURANTE.SP_S_PEDIDOS_POR_MESA(:mesaId, :cursor); END;`,
        {
          mesaId: parseInt(mesaId),
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



module.exports = { getMesas, insertMesa, updateMesaEstado, getPedidosPorMesa };
