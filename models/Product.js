const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 50,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
