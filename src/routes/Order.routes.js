const express = require('express');
const router = express.Router();
const { createOrder, getOrder, deleteAllRecords } = require('../controllers/Order.controller');

router.delete('/', deleteAllRecords)
router.post('/', createOrder);
router.get('/:id', getOrder);

module.exports = router;    
