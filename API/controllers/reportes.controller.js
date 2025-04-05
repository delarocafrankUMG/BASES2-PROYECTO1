const oracledb = require('oracledb');
const { getConnection } = require('../db/connection');

const getViewData = async (req, res) => {
  let connection;

  try {
    const { viewName } = req.params;

    const allowedViews = [
      'VW_ESTADISTICAS_VENTAS',
      'VW_TOP_PRODUCTOS_SEMANALES',
      'VW_TOP_PRODUCTOS_MENSUALES',
      'VW_TOP_PRODUCTOS_ANUALES',
      'VW_VENTAS_DIARIAS',
      'VW_PEDIDOS_POR_MESERO',
      'VW_CIERRES_CAJA',
      'VW_ESTADO_MESAS',
      'VW_PEDIDOS_EN_CURSO',
      'VW_PRODUCTOS_MAS_VENDIDOS'
    ];

    if (!allowedViews.includes(viewName.toUpperCase())) {
      return res.status(400).json({ error: "Vista no permitida" });
    }

    connection = await getConnection();
    const query = `SELECT * FROM RESTAURANTE.${viewName}`;
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar la vista:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection && typeof connection.close === 'function') {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error al cerrar la conexión:', closeErr);
      }
    }
  }
};

module.exports = { getViewData };
