const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street ||
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Complete shipping address is required.' });
    }

    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const items = user.cart.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Clear the cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error placing order.' });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching order.' });
  }
});

module.exports = router;
