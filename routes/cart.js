const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const cart = user.cart.filter(item => item.product); // remove null refs
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cart.' });
  }
});

// Add to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    const populated = await User.findById(req.user._id).populate('cart.product');
    res.json(populated.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding to cart.' });
  }
});

// Update cart item quantity
router.put('/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    const populated = await User.findById(req.user._id).populate('cart.product');
    res.json(populated.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating cart.' });
  }
});

// Remove from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();

    const populated = await User.findById(req.user._id).populate('cart.product');
    res.json(populated.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error removing from cart.' });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error clearing cart.' });
  }
});

module.exports = router;
