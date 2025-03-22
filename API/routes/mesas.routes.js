const express = require("express");
const { getMesas, insertMesa, updateMesaEstado } = require("../controllers/mesas.controller");

const router = express.Router();

router.get("/", getMesas);
router.post("/", insertMesa);
router.put("/:id", updateMesaEstado);

module.exports = router;