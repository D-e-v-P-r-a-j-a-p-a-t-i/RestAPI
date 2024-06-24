const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, addMany, deleteAll } = require('../controllers/Product.controller');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', addMany);
router.delete('/', deleteAll)

module.exports = router;
