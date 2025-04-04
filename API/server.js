const express = require("express");
const cors = require('cors');
const mesasRoutes = require("./routes/mesas.routes");
const cajasRoutes = require("./routes/cajas.routes");
const facturasRoutes = require("./routes/facturas.routes");
const pedidosRoutes = require("./routes/pedidos.routes");
const empleadosRoutes = require("./routes/empleados.routes");
const reportesRoutes = require("./routes/reportes.routes");


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/mesas", mesasRoutes);
app.use("/api/cajas", cajasRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/reportes", reportesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});