const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCart, deleteCartItem, deleteCart } = require('../controllers/Cart.controller');

router.post('/', addToCart);
// router.get('/', getCart);
router.get('/:userId', getCart);
router.put('/:cartId/item/:id', updateCart);
router.delete('/:cartId/item/:itemId', deleteCartItem);
router.delete('/:userId', deleteCart)

module.exports = router;
