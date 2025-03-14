const express = require("express");
const mesasRoutes = require("./routes/mesas.routes");

const app = express();
app.use(express.json());

app.use("/api/mesas", mesasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});