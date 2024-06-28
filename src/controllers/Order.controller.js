const Order = require('../models/Order');

const deleteAllRecords = async (req, res) => {
  try {
    await Order.deleteMany();
    res.status(200).json({message: "All records deleted successfully!"})
  } catch (error) {
    res.status(400).json({message: "Unable to delete all records!"})
  }
}

const createOrder = async (req, res) => {
  try {
    console.log("order data", req.body);
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error getting order:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrder, deleteAllRecords };
