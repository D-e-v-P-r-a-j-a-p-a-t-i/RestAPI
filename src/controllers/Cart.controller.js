const mongoose = require('mongoose');
const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    console.log(req.body);

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: 'User ID, product ID, and quantity are required' });
    }

    let cart = await Cart.findOne({ user: userId });

    console.log(cart);

    if (cart != null) {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity }); // Use productObjectId here
      }
    } else {
      cart = new Cart({ user: userId, products: [{ productId, quantity }] });
    }

    console.log(cart);

    await cart.save();
    console.log("hello");
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
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    console.log(req.body);
    const cart = await Cart.findByIdAndUpdate(req.params.cartId, req.body, { new: true });
    if (cart != null) {
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

    console.log(req.params);

    // Ensure cartId and itemId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid cart ID or item ID' });
    }

    // Use the $pull operator to remove the product from the cart's products array
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
    console.log(userId);
    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cart', error: error.message });
  }
};

module.exports = { addToCart, getCart, updateCart, deleteCartItem, deleteCart };
