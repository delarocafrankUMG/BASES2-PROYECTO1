const express = require("express");
const mesasRoutes = require("./routes/mesas.routes");
const cajasRoutes = require("./routes/cajas.routes");
const facturasRoutes = require("./routes/facturas.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

const app = express();
app.use(express.json());

app.use("/api/mesas", mesasRoutes);
app.use("/api/cajas", cajasRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/pedidos", pedidosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});