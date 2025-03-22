const { getConnection } = require("../db/connection");

// Abrir una caja
async function abrirCaja(req, res) {
  const { empleadoId, saldoApertura } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_I_APERTURA_CAJA(:empleadoId, :saldoApertura); END;`,
      { empleadoId, saldoApertura }
    );
    await connection.commit();
    res.status(201).json({ message: "Caja abierta correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Cerrar una caja
async function cerrarCaja(req, res) {
  const { id } = req.params;
  const { saldoCierre } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_U_CIERRE_CAJA(:id, :saldoCierre); END;`,
      { id, saldoCierre }
    );
    await connection.commit();
    res.json({ message: "Caja cerrada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// Obtener todas las cajas
async function getCajas(req, res) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN RESTAURANTE.SP_S_CAJA(:cursor); END;`,
        { cursor: { dir: require("oracledb").BIND_OUT, type: require("oracledb").CURSOR } }
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

module.exports = { abrirCaja, cerrarCaja, getCajas };
