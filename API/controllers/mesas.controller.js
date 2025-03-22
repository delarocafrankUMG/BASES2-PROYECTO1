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
    cursor.close();
    res.json(rows);
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

module.exports = { getMesas, insertMesa, updateMesaEstado };
