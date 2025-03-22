const { getConnection } = require("../db/connection"); // Asegúrate de importar tu conexión a Oracle
const oracledb = require("oracledb");

//Generar una factura
async function generarFactura(req, res) {
  const { pedidoId, cajaId, total, metodoPago } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN RESTAURANTE.SP_I_FACTURAR(:pedidoId, :cajaId, :total, :metodoPago); END;`,
      { pedidoId, cajaId, total, metodoPago }
    );
    await connection.commit();
    res.status(201).json({ message: "Factura generada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

//Obtener todas las facturas
async function getFacturas(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_S_FACTURA(:cursor); END;`,
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

module.exports = { generarFactura, getFacturas };
