const express = require('express');
const router = express.Router();
const { getViewData } = require('../controllers/reportes.controller');

router.get('/:viewName', getViewData);

module.exports = router;