const { getConnection } = require("../db/connection");
const oracledb = require("oracledb");

async function validateLogin(req, res) {
  let connection;
  try {
    const { username, password } = req.body;
    connection = await getConnection();

    // Llamar al procedimiento almacenado con el cursor
    const result = await connection.execute(
      `BEGIN RESTAURANTE.SP_VALIDATE_LOGIN(:username, :password, :cursor); END;`,
      {
        username: { val: username, type: oracledb.STRING },
        password: { val: password, type: oracledb.STRING },
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    // Obtener el cursor y los resultados
    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows(); // Obtener las filas del cursor
    const metaData = resultSet.metaData.map(col => col.name.toLowerCase());
    await resultSet.close(); // Cerrar el cursor

    // Si el cursor tiene filas, devolver los datos del empleado
    if (rows.length > 0) {
      const empleado = rows.map(row =>
        Object.fromEntries(row.map((value, index) => [metaData[index], value]))
      )[0]; // Solo devolver el primer resultado
      res.status(200).json(empleado);
    } else {
      // Si no hay resultados (usuario o contraseña incorrectos)
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
  }

  module.exports = { validateLogin }