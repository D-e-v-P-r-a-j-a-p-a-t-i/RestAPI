// controllers/Cart.controller.js

const Cart = require('../models/Cart');
const mongoose = require('mongoose');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log(quantity)
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: 'User ID, product ID, and quantity are required' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart != null) {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        if(quantity === 1){
          cart.products[productIndex].quantity += quantity;
        }
        else{
          cart.products[productIndex].quantity = quantity;
        }
      } else {
        cart.products.push({ productId, quantity });
      }
    } else {
      cart = new Cart({ user: userId, products: [{ productId, quantity }] });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('products.productId').exec();
    console.log(cart)
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cartId, req.body, { new: true });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid cart ID or item ID' });
    }
    console.log("in delete")
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { _id: itemId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json({ message: 'Cart item deleted', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cart', error: error.message });
  }
};

const synchronizeCart = async (req, res) => {
  try {
    const { userId, cart } = req.body;

    if (!userId || !cart || !Array.isArray(cart)) {
      return res.status(400).json({ message: 'User ID and a valid cart array are required' });
    }

    let userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      userCart.products = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
    } else {
      userCart = new Cart({
        user: userId,
        products: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });
    }

    await userCart.save();
    res.status(200).json(userCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addToCart, getCart, updateCart, deleteCartItem, deleteCart, synchronizeCart };
