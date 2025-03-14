const { getConnection } = require("../db/connection");
const oracledb = require("oracledb");

// Obtener todas las mesas
async function getMesas(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_MESAS(:cursor); END;`,
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
      `BEGIN RESTAURANTE.SP_I_MESAS(:numero, :estado); END;`,
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

module.exports = { getMesas, insertMesa };
