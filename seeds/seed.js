require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const Product = require('../models/Product');

const allImageUrls = [
  "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71ZDY57yTQL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61f+2PfBGL._AC_UF894,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71sbmdyPlkL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61Z19YvlzFS._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71JiCDlV1AL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81joRLWgMGL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61KZK77Vt8L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/51X1axWGFZL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61u48FEsS-L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71p1L3X-ViL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81Caa1OlvhL._AC_UF894,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61+Q6Rh3OQL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71f6zM0YzPL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81QpkIctqPL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71K1z5zv9kL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61WkDP0XcGL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71X5I6p6ZUL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81WcnNQ-TBL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61Rk5n7p5TL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71z8Qv7kKDL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81fPKd-2AYL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71T5g5X7JTL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61nPiOO+7DL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81g5v7kX2kL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71hGz9v9KkL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61jX8Z4z3AL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81z9p9XkKUL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71fZ6v7ZkEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61+vJQ2sJmL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71Lz0fF9qGL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81Jv9pK9dNL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71g5xXxKzDL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61g9X2k9lCL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81x9p9XkKYL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71Z6p7kXxEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61z9p9XkKLL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81Q9p9XkKUL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71z9p9XkKYL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61K5Z6v7XEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71P6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81P6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61P6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71K6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81K6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61Z6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71Z6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81Z6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61X6v7ZkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71H7j4P7yKL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81mX4wa3C-L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61LtuGzXeaL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71r69Y7BSeL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81u6z9Kz0bL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61kWB+uzR2L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71dEY4Neo3L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61y2VVWcGBL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81QwQ9hYFVL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61C7Vb0R8ML._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71xW4Wn0K9L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81+e9XqYx9L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61d5pK6hVZL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71JcQ9xkJDL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81Xz3t9bKUL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61n8v7gZ6HL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71kZ6p9XbBL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81cR7v9kKkL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61r8Z7Xk2LL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71Xjv7ZkKpL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81M8Z7XkKqL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61G8Z7XkKrL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71H8Z7XkKsL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81I8Z7XkKtL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61J8Z7XkKuL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71K8Z7XkKvL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81L8Z7XkKwL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61M8Z7XkKxL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71N8Z7XkKyL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81O8Z7XkKzL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61P8Z7XkK0L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71Q8Z7XkK1L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81R8Z7XkK2L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61S8Z7XkK3L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71T8Z7XkK4L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81U8Z7XkK5L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61V8Z7XkK6L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71W8Z7XkK7L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81X8Z7XkK8L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61Y8Z7XkK9L._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71Z8Z7XkKAL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81a8Z7XkKBL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61b8Z7XkKCL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71c8Z7XkKDL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81d8Z7XkKEL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61e8Z7XkKFL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/71f8Z7XkKGL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/81g8Z7XkKHL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61h8Z7XkKIL._AC_UF1000,1000_QL80_.jpg"
];

// Product templates - will be matched with valid images
const categories = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Personal Care',
  'Sports & Outdoors', 'Books', 'Toys & Games', 'Automotive',
  'Garden & Outdoor', 'Office Supplies'
];

const productTemplates = [
  // Electronics
  { name: 'Wireless Bluetooth Headphones Pro', description: 'Premium noise-cancelling wireless headphones with 40-hour battery life, deep bass, and crystal-clear audio. Features adaptive ANC and multipoint connectivity.', price: 79.99, originalPrice: 129.99, category: 'Electronics', rating: 4.5, reviewCount: 2341, featured: true },
  { name: 'Smart Fitness Tracker Watch', description: 'Advanced fitness tracker with heart rate monitoring, GPS, SpO2 sensor, sleep tracking, and 14-day battery life. Water resistant to 50m.', price: 49.99, originalPrice: 89.99, category: 'Electronics', rating: 4.3, reviewCount: 1876, featured: true },
  { name: 'Portable Bluetooth Speaker', description: 'Ultra-portable waterproof speaker with 360° sound, 24-hour playtime, and built-in microphone. Perfect for outdoor adventures.', price: 34.99, originalPrice: 59.99, category: 'Electronics', rating: 4.6, reviewCount: 3210 },
  { name: 'USB-C Fast Charging Hub', description: '7-in-1 USB-C hub with 4K HDMI, 100W PD charging, SD card reader, and 3 USB 3.0 ports. Compatible with all USB-C devices.', price: 29.99, originalPrice: 49.99, category: 'Electronics', rating: 4.4, reviewCount: 987 },
  { name: 'Wireless Charging Pad Duo', description: 'Dual wireless charging pad for smartphones and earbuds. Supports 15W fast charging with LED indicator and foreign object detection.', price: 24.99, originalPrice: 39.99, category: 'Electronics', rating: 4.2, reviewCount: 1543 },
  { name: 'Mini Portable Projector', description: 'Compact 1080p portable projector with built-in speakers, HDMI, USB, and wireless screen mirroring. Projects up to 120 inches.', price: 149.99, originalPrice: 249.99, category: 'Electronics', rating: 4.1, reviewCount: 876, featured: true },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB mechanical keyboard with hot-swappable switches, programmable macros, aluminum frame, and detachable USB-C cable.', price: 69.99, originalPrice: 99.99, category: 'Electronics', rating: 4.7, reviewCount: 2198 },
  { name: 'Wireless Gaming Mouse', description: 'Ergonomic wireless gaming mouse with 25600 DPI sensor, 6 programmable buttons, and 70-hour battery life. Ultra-lightweight design.', price: 44.99, originalPrice: 69.99, category: 'Electronics', rating: 4.5, reviewCount: 1654 },
  { name: 'Noise Cancelling Earbuds', description: 'True wireless earbuds with hybrid ANC, transparency mode, spatial audio, and 30-hour total battery life with charging case.', price: 59.99, originalPrice: 99.99, category: 'Electronics', rating: 4.4, reviewCount: 3890 },
  { name: 'Webcam 4K Ultra HD', description: 'Professional 4K webcam with auto-focus, built-in ring light, dual microphones, and privacy cover. Perfect for streaming and video calls.', price: 54.99, originalPrice: 79.99, category: 'Electronics', rating: 4.3, reviewCount: 1234 },

  // Fashion
  { name: 'Classic Leather Messenger Bag', description: 'Handcrafted genuine leather messenger bag with padded laptop compartment, brass hardware, and adjustable shoulder strap. Fits 15" laptops.', price: 89.99, originalPrice: 149.99, category: 'Fashion', rating: 4.6, reviewCount: 876, featured: true },
  { name: 'Premium Aviator Sunglasses', description: 'Polarized aviator sunglasses with UV400 protection, titanium frame, and scratch-resistant lenses. Includes premium carrying case.', price: 39.99, originalPrice: 79.99, category: 'Fashion', rating: 4.4, reviewCount: 2345 },
  { name: 'Minimalist Canvas Backpack', description: 'Durable water-resistant canvas backpack with USB charging port, anti-theft pocket, and padded laptop sleeve. Capacity: 25L.', price: 44.99, originalPrice: 69.99, category: 'Fashion', rating: 4.5, reviewCount: 1987 },
  { name: 'Stainless Steel Watch Classic', description: 'Elegant stainless steel analog watch with Japanese quartz movement, sapphire crystal glass, and genuine leather strap. Water resistant 100m.', price: 129.99, originalPrice: 249.99, category: 'Fashion', rating: 4.7, reviewCount: 654 },
  { name: 'Premium Leather Wallet', description: 'Slim RFID-blocking bifold wallet with genuine leather, 8 card slots, 2 bill compartments, and ID window. Gift-box included.', price: 29.99, originalPrice: 49.99, category: 'Fashion', rating: 4.3, reviewCount: 3456 },
  { name: 'Athletic Running Shoes', description: 'Lightweight breathable running shoes with responsive cushioning, anti-slip rubber outsole, and reflective details for night running.', price: 64.99, originalPrice: 109.99, category: 'Fashion', rating: 4.5, reviewCount: 4321, featured: true },
  { name: 'Cashmere Blend Scarf', description: 'Luxurious cashmere blend scarf with elegant houndstooth pattern. Soft, warm, and lightweight. Perfect for all seasons.', price: 34.99, originalPrice: 59.99, category: 'Fashion', rating: 4.6, reviewCount: 789 },
  { name: 'Titanium Bracelet', description: 'Modern titanium link bracelet with magnetic clasp. Hypoallergenic, lightweight, and durable. Adjustable length fits most wrists.', price: 24.99, originalPrice: 44.99, category: 'Fashion', rating: 4.2, reviewCount: 1098 },
  { name: 'Travel Duffel Bag', description: 'Spacious weekender duffel bag with separate shoe compartment, water-resistant fabric, and trolley sleeve. Ideal for short trips.', price: 54.99, originalPrice: 89.99, category: 'Fashion', rating: 4.4, reviewCount: 1567 },
  { name: 'Designer Belt Collection', description: 'Reversible genuine leather belt with two interchangeable buckles (silver & gold). One belt, multiple looks. Gift box included.', price: 39.99, originalPrice: 69.99, category: 'Fashion', rating: 4.3, reviewCount: 2234 },

  // Home & Kitchen
  { name: 'Smart Air Purifier', description: 'HEPA air purifier with smart sensor, auto mode, sleep mode, and app control. Covers up to 1000 sq ft. Removes 99.97% of allergens.', price: 129.99, originalPrice: 199.99, category: 'Home & Kitchen', rating: 4.6, reviewCount: 2876 },
  { name: 'Stainless Steel Cookware Set', description: '10-piece tri-ply stainless steel cookware set with tempered glass lids. Induction compatible, oven safe to 500°F, dishwasher safe.', price: 149.99, originalPrice: 299.99, category: 'Home & Kitchen', rating: 4.7, reviewCount: 1543, featured: true },
  { name: 'Memory Foam Pillow Set', description: 'Contoured cervical memory foam pillows (set of 2) with cooling gel layer and breathable bamboo cover. Relieves neck and shoulder pain.', price: 39.99, originalPrice: 69.99, category: 'Home & Kitchen', rating: 4.4, reviewCount: 4567 },
  { name: 'Automatic Espresso Machine', description: 'Bean-to-cup automatic espresso machine with built-in grinder, milk frother, and 15-bar pump. Brew espresso, cappuccino, and latte.', price: 249.99, originalPrice: 449.99, category: 'Home & Kitchen', rating: 4.5, reviewCount: 987 },
  { name: 'LED Desk Lamp Modern', description: 'Sleek LED desk lamp with wireless charging pad, 5 color temperatures, touch dimmer, and USB port. Adjustable arm and head.', price: 44.99, originalPrice: 79.99, category: 'Home & Kitchen', rating: 4.3, reviewCount: 2109 },
  { name: 'Robot Vacuum Cleaner', description: 'Smart robot vacuum with LiDAR navigation, 3000Pa suction, auto-empty station, and app control. Cleans carpet and hardwood floors.', price: 299.99, originalPrice: 499.99, category: 'Home & Kitchen', rating: 4.6, reviewCount: 3421 },
  { name: 'Bamboo Cutting Board Set', description: 'Premium organic bamboo cutting board set (3 sizes) with juice grooves, non-slip feet, and easy-grip handles. BPA-free and eco-friendly.', price: 24.99, originalPrice: 44.99, category: 'Home & Kitchen', rating: 4.5, reviewCount: 1876 },
  { name: 'Smart Thermos Bottle', description: 'Insulated smart water bottle with LED temperature display, keeps drinks hot 24hrs/cold 48hrs. Food-grade stainless steel, 500ml.', price: 29.99, originalPrice: 49.99, category: 'Home & Kitchen', rating: 4.4, reviewCount: 2345 },
  { name: 'Weighted Blanket Luxury', description: 'Premium 15lb weighted blanket with cooling bamboo cover and glass bead filling. Promotes better sleep and reduces anxiety.', price: 59.99, originalPrice: 99.99, category: 'Home & Kitchen', rating: 4.6, reviewCount: 5678 },
  { name: 'Electric Kettle Glass', description: 'Borosilicate glass electric kettle with LED illumination, 6 temperature presets, keep-warm function, and auto shut-off. 1.7L capacity.', price: 34.99, originalPrice: 54.99, category: 'Home & Kitchen', rating: 4.5, reviewCount: 3210 },

  // Beauty & Personal Care
  { name: 'Professional Hair Dryer', description: 'Ionic hair dryer with 110,000 RPM motor, 3 heat settings, cool shot button, magnetic nozzles, and diffuser attachment. Reduces frizz by 80%.', price: 69.99, originalPrice: 129.99, category: 'Beauty & Personal Care', rating: 4.5, reviewCount: 3456 },
  { name: 'LED Vanity Mirror', description: 'Trifold LED vanity mirror with 1x/2x/3x magnification, touch dimmer, 72 LED lights, and USB charging. 180° adjustable rotation.', price: 34.99, originalPrice: 59.99, category: 'Beauty & Personal Care', rating: 4.4, reviewCount: 2109 },
  { name: 'Electric Toothbrush Premium', description: 'Sonic electric toothbrush with 5 brushing modes, smart timer, pressure sensor, and 30-day battery life. Includes 4 brush heads.', price: 39.99, originalPrice: 79.99, category: 'Beauty & Personal Care', rating: 4.6, reviewCount: 5432 },
  { name: 'Skincare Gift Set', description: 'Luxury skincare set with cleanser, toner, serum, moisturizer, and eye cream. Natural ingredients, suitable for all skin types.', price: 49.99, originalPrice: 89.99, category: 'Beauty & Personal Care', rating: 4.3, reviewCount: 1876, featured: true },
  { name: 'Electric Shaver Pro', description: 'Rechargeable rotary electric shaver with pop-up trimmer, wet/dry operation, and travel lock. IPX7 waterproof. 60-min runtime.', price: 54.99, originalPrice: 99.99, category: 'Beauty & Personal Care', rating: 4.4, reviewCount: 2987 },
  { name: 'Hair Straightener Ceramic', description: 'Professional ceramic flat iron with floating plates, adjustable temperature (250-450°F), auto shut-off, and swivel cord.', price: 44.99, originalPrice: 79.99, category: 'Beauty & Personal Care', rating: 4.5, reviewCount: 3210 },
  { name: 'Aromatherapy Diffuser', description: 'Ultrasonic essential oil diffuser with 7 LED colors, mist modes, timer settings, and auto shut-off. Whisper-quiet operation. 300ml.', price: 24.99, originalPrice: 44.99, category: 'Beauty & Personal Care', rating: 4.6, reviewCount: 4567 },
  { name: 'Makeup Brush Set Professional', description: '24-piece professional makeup brush set with synthetic bristles, wooden handles, and premium PU leather roll case. Vegan and cruelty-free.', price: 29.99, originalPrice: 54.99, category: 'Beauty & Personal Care', rating: 4.3, reviewCount: 1543 },
  { name: 'Facial Cleansing Device', description: 'Silicone facial cleansing brush with sonic vibration, 8 intensity levels, waterproof design, and USB charging. Removes 99.5% of impurities.', price: 34.99, originalPrice: 64.99, category: 'Beauty & Personal Care', rating: 4.4, reviewCount: 2345 },
  { name: 'Nail Art Kit Complete', description: 'Complete nail art kit with UV LED lamp, 36 gel polish colors, base/top coat, nail tools, and accessories. Professional salon quality.', price: 44.99, originalPrice: 79.99, category: 'Beauty & Personal Care', rating: 4.2, reviewCount: 1098 },

  // Sports & Outdoors
  { name: 'Yoga Mat Premium', description: 'Extra thick 6mm eco-friendly TPE yoga mat with alignment guide lines, non-slip surface, and carrying strap. 72" x 24" with optimal cushioning.', price: 29.99, originalPrice: 49.99, category: 'Sports & Outdoors', rating: 4.5, reviewCount: 3456 },
  { name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbell set from 5-52.5 lbs per dumbbell. Quick-change mechanism replaces 15 sets of weights. Includes stand.', price: 199.99, originalPrice: 349.99, category: 'Sports & Outdoors', rating: 4.7, reviewCount: 2109 },
  { name: 'Camping Tent 4-Person', description: 'Waterproof 4-season camping tent with easy setup, double-wall design, vestibule, and carry bag. Floor area: 82 sq ft.', price: 89.99, originalPrice: 159.99, category: 'Sports & Outdoors', rating: 4.4, reviewCount: 1876 },
  { name: 'Resistance Band Set', description: '11-piece resistance band set with 5 resistance levels, handles, ankle straps, door anchor, and carrying case. Full body workout.', price: 19.99, originalPrice: 39.99, category: 'Sports & Outdoors', rating: 4.6, reviewCount: 6789 },
  { name: 'Insulated Water Bottle', description: 'Triple-insulated 32oz water bottle with straw lid, keeps drinks cold 24hrs/hot 12hrs. BPA-free, leak-proof, and sweat-proof.', price: 24.99, originalPrice: 39.99, category: 'Sports & Outdoors', rating: 4.5, reviewCount: 4321 },
  { name: 'Folding Exercise Bike', description: 'Compact folding exercise bike with magnetic resistance, LCD display, heart rate monitor, and adjustable seat. Whisper-quiet operation.', price: 159.99, originalPrice: 279.99, category: 'Sports & Outdoors', rating: 4.3, reviewCount: 1543 },
  { name: 'Hiking Backpack 50L', description: 'Ergonomic 50L hiking backpack with rain cover, hydration compatible, multiple compartments, and ventilated back panel. Lightweight frame.', price: 64.99, originalPrice: 109.99, category: 'Sports & Outdoors', rating: 4.6, reviewCount: 2345 },
  { name: 'Jump Rope Speed Pro', description: 'Weighted speed jump rope with ball bearings, adjustable cable, non-slip handles, and memory foam grip. Includes carrying case.', price: 14.99, originalPrice: 29.99, category: 'Sports & Outdoors', rating: 4.4, reviewCount: 3210 },
  { name: 'Foam Roller Massage', description: 'High-density foam roller with textured surface for deep tissue massage. Relieves muscle tension and improves flexibility. 18" length.', price: 19.99, originalPrice: 34.99, category: 'Sports & Outdoors', rating: 4.5, reviewCount: 2876 },
  { name: 'Bike Phone Mount', description: 'Universal bike phone mount with 360° rotation, quick-release lock, and anti-shake silicone pad. Fits all smartphones 4.5-7.0 inches.', price: 12.99, originalPrice: 24.99, category: 'Sports & Outdoors', rating: 4.3, reviewCount: 1987 },

  // Books
  { name: 'The Art of Innovation', description: 'Bestselling guide to creative problem-solving and innovation in business. Learn from real-world case studies and actionable strategies. 384 pages.', price: 14.99, originalPrice: 24.99, category: 'Books', rating: 4.6, reviewCount: 5678 },
  { name: 'Mastering JavaScript', description: 'Comprehensive guide to modern JavaScript from basics to advanced patterns. Covers ES6+, async/await, Node.js, and frameworks. 520 pages.', price: 29.99, originalPrice: 49.99, category: 'Books', rating: 4.7, reviewCount: 3210 },
  { name: 'Mindful Living Cookbook', description: 'Over 150 plant-based recipes for healthy, sustainable living. Beautiful photography, nutritional info, and meal planning guides. Hardcover.', price: 19.99, originalPrice: 34.99, category: 'Books', rating: 4.4, reviewCount: 2109 },
  { name: 'The Psychology of Success', description: 'Groundbreaking research on the habits and mindsets of high achievers. Practical exercises for personal growth and peak performance.', price: 16.99, originalPrice: 29.99, category: 'Books', rating: 4.5, reviewCount: 4321 },
  { name: 'Digital Photography Guide', description: 'Complete guide to digital photography covering composition, lighting, editing, and post-processing. For beginners to advanced photographers.', price: 24.99, originalPrice: 44.99, category: 'Books', rating: 4.3, reviewCount: 1876 },
  { name: 'Science Fiction Collection', description: 'Award-winning science fiction anthology featuring 20 stories from acclaimed authors. Explores AI, space exploration, and future societies.', price: 12.99, originalPrice: 22.99, category: 'Books', rating: 4.6, reviewCount: 3456 },
  { name: 'Financial Freedom Blueprint', description: 'Step-by-step guide to achieving financial independence through investing, saving, and passive income strategies. Includes worksheets.', price: 18.99, originalPrice: 32.99, category: 'Books', rating: 4.4, reviewCount: 2876 },
  { name: 'Modern Architecture Design', description: 'Stunning coffee table book featuring 100 most innovative modern architectural designs worldwide. 300+ high-quality photographs.', price: 39.99, originalPrice: 69.99, category: 'Books', rating: 4.7, reviewCount: 987 },
  { name: 'Meditation & Mindfulness', description: 'Practical guide to meditation and mindfulness with guided exercises, breathing techniques, and daily practice schedules for inner peace.', price: 13.99, originalPrice: 24.99, category: 'Books', rating: 4.5, reviewCount: 5432 },
  { name: 'World Travel Atlas', description: 'Illustrated world travel atlas with maps, cultural insights, travel tips, and bucket list destinations for every continent. 480 pages.', price: 34.99, originalPrice: 59.99, category: 'Books', rating: 4.6, reviewCount: 1543 },

  // Toys & Games
  { name: 'Building Blocks Mega Set', description: '1000-piece creative building blocks set compatible with major brands. Includes base plates, mini figures, and instruction booklet. Ages 6+.', price: 34.99, originalPrice: 59.99, category: 'Toys & Games', rating: 4.7, reviewCount: 4567 },
  { name: 'Remote Control Drone', description: 'HD camera drone with 30-min flight time, GPS auto-return, follow-me mode, and gesture control. Includes carrying case and spare propellers.', price: 89.99, originalPrice: 159.99, category: 'Toys & Games', rating: 4.4, reviewCount: 2345 },
  { name: 'Strategy Board Game', description: 'Award-winning strategy board game for 2-4 players. Build civilizations, manage resources, and conquer territories. 90-min playtime.', price: 39.99, originalPrice: 59.99, category: 'Toys & Games', rating: 4.8, reviewCount: 3210 },
  { name: 'RC Monster Truck', description: 'All-terrain RC monster truck with 4WD, 40km/h speed, waterproof electronics, and rechargeable battery. Full proportional steering.', price: 49.99, originalPrice: 89.99, category: 'Toys & Games', rating: 4.5, reviewCount: 1876 },
  { name: 'Science Experiment Kit', description: 'Complete science experiment kit with 60+ experiments covering chemistry, physics, and biology. Educational and fun. Ages 8-14.', price: 29.99, originalPrice: 49.99, category: 'Toys & Games', rating: 4.6, reviewCount: 2109 },
  { name: 'Puzzle Collection 3D', description: 'Premium 3D puzzle collection featuring world landmarks (5 puzzles). No glue required. 500+ pieces total. Great display pieces.', price: 24.99, originalPrice: 44.99, category: 'Toys & Games', rating: 4.3, reviewCount: 1543 },
  { name: 'Art Supply Set Deluxe', description: 'Deluxe art supply kit with 150+ pieces including colored pencils, watercolors, oil pastels, sketch pads, and wooden carrying case.', price: 44.99, originalPrice: 79.99, category: 'Toys & Games', rating: 4.5, reviewCount: 2876 },
  { name: 'Electronic Learning Tablet', description: 'Kids learning tablet with 200+ educational games, activities, and e-books. 7" HD screen, durable design, and parental controls. Ages 3-9.', price: 79.99, originalPrice: 129.99, category: 'Toys & Games', rating: 4.4, reviewCount: 3456 },
  { name: 'Magnetic Tile Building Set', description: 'Colorful magnetic tile set (100 pieces) for creative 3D construction. Develops STEM skills. Strong magnets, safe materials. Ages 3+.', price: 39.99, originalPrice: 69.99, category: 'Toys & Games', rating: 4.7, reviewCount: 5678 },
  { name: 'Action Figure Collection', description: 'Deluxe action figure collection with 6 detailed figurines, accessories, and display stand. Articulated joints for dynamic posing.', price: 34.99, originalPrice: 54.99, category: 'Toys & Games', rating: 4.3, reviewCount: 1098 },

  // Automotive
  { name: 'Dash Camera 4K', description: 'Ultra HD 4K dash camera with night vision, 170° wide angle, GPS, WiFi, parking mode, and loop recording. Includes 64GB SD card.', price: 79.99, originalPrice: 139.99, category: 'Automotive', rating: 4.5, reviewCount: 3210 },
  { name: 'Car Phone Mount', description: 'Magnetic car phone mount with 360° rotation, one-hand operation, and strong N52 magnets. Dashboard and vent clip included.', price: 14.99, originalPrice: 29.99, category: 'Automotive', rating: 4.4, reviewCount: 6789 },
  { name: 'Tire Inflator Portable', description: 'Rechargeable portable tire inflator with digital pressure gauge, LED light, auto shut-off, and preset pressure modes. Compact design.', price: 39.99, originalPrice: 69.99, category: 'Automotive', rating: 4.6, reviewCount: 2345 },
  { name: 'Car Vacuum Cleaner', description: 'Powerful cordless car vacuum with 12000Pa suction, HEPA filter, LED light, and multiple attachments. 30-min runtime. Wet/dry use.', price: 34.99, originalPrice: 59.99, category: 'Automotive', rating: 4.3, reviewCount: 1876 },
  { name: 'LED Car Interior Lights', description: '4-piece RGB LED car interior light kit with app control, music sync, 16 million colors, and DIY modes. Easy plug-and-play installation.', price: 19.99, originalPrice: 39.99, category: 'Automotive', rating: 4.5, reviewCount: 4321 },
  { name: 'Seat Cushion Memory Foam', description: 'Ergonomic memory foam car seat cushion with cooling gel, non-slip bottom, and zippered washable cover. Relieves back pain during driving.', price: 29.99, originalPrice: 49.99, category: 'Automotive', rating: 4.4, reviewCount: 2876 },
  { name: 'Car Emergency Kit', description: 'Complete car emergency kit with jumper cables, first aid supplies, flashlight, tools, reflective vest, and glass breaker. 125-piece set.', price: 49.99, originalPrice: 89.99, category: 'Automotive', rating: 4.6, reviewCount: 1543 },
  { name: 'Steering Wheel Cover', description: 'Premium leather steering wheel cover with anti-slip design, breathable material, and universal fit (14.5-15"). Easy installation.', price: 16.99, originalPrice: 29.99, category: 'Automotive', rating: 4.2, reviewCount: 3456 },
  { name: 'Blind Spot Mirror Set', description: 'Adjustable blind spot mirrors (2-pack) with frameless convex design and 3M adhesive. 360° rotation, rain-proof nano coating.', price: 9.99, originalPrice: 19.99, category: 'Automotive', rating: 4.5, reviewCount: 5432 },
  { name: 'Car Air Freshener Set', description: 'Natural essential oil car air freshener clips (6-pack) with refillable design. Aromatherapy-grade scents. Lasts 30+ days each.', price: 12.99, originalPrice: 24.99, category: 'Automotive', rating: 4.3, reviewCount: 2109 },
];

// Validate image URL - returns true if accessible (HTTP 200)
function checkImageUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 5000 }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        checkImageUrl(res.headers.location).then(resolve);
        return;
      }
      resolve(res.statusCode === 200);
      res.destroy();
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Validate all image URLs
    console.log(`Validating ${allImageUrls.length} image URLs...`);
    const validationResults = await Promise.all(
      allImageUrls.map(async (url) => {
        const isValid = await checkImageUrl(url);
        return { url, isValid };
      })
    );

    const validImages = validationResults.filter(r => r.isValid).map(r => r.url);
    const discardedCount = allImageUrls.length - validImages.length;
    console.log(`Valid images: ${validImages.length}, Discarded (404): ${discardedCount}`);

    if (validImages.length === 0) {
      console.log('No valid images found! Using placeholder.');
      validImages.push('https://via.placeholder.com/400x400?text=Product');
    }

    // Assign valid images to products
    const products = productTemplates.map((template, index) => ({
      ...template,
      image: validImages[index % validImages.length],
      stock: Math.floor(Math.random() * 100) + 10
    }));

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully!`);

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
