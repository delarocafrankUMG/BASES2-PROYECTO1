const express = require("express");
const { getMesas, insertMesa } = require("../controllers/mesas.controller");

const router = express.Router();

router.get("/", getMesas);
router.post("/", insertMesa);

module.exports = router;