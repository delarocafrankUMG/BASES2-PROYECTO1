const express = require("express");
const { validateLogin } = require("../controllers/empleados.controller");

const router = express.Router();

router.post("/", validateLogin);
module.exports = router;