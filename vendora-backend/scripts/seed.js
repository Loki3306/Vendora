// @module database | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const bcrypt = require('bcrypt');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { checkDatabaseConnection, closeDatabaseConnection } = require('../src/config/database');
const { Counter, User, Vendor, Category, Product, Order, OrderItem, Cart, Review, Notification } = require('../src/models');
const { setSequence } = require('../src/services/id.service');

const SALT_ROUNDS = 12;

async function seed() {
  await checkDatabaseConnection();
  await Promise.all([
    Counter.deleteMany({}), Notification.deleteMany({}), Review.deleteMany({}), Cart.deleteMany({}),
    OrderItem.deleteMany({}), Order.deleteMany({}), Product.deleteMany({}), Category.deleteMany({}),
    Vendor.deleteMany({}), User.deleteMany({}),
  ]);

  const userSeed = [
    [1, 'Rahul Mehta', 'rahul.m@gmail.com', 'password123', 'customer'],
    [2, 'Priya Sharma', 'priya.s@gmail.com', 'password123', 'customer'],
    [3, 'Arjun Kumar', 'arjun.k@gmail.com', 'password123', 'vendor'],
    [4, 'Pooja Iyer', 'pooja.i@gmail.com', 'password123', 'vendor'],
    [5, 'Ravi Joshi', 'ravi.j@gmail.com', 'password123', 'vendor'],
    [6, 'Admin User', 'admin@vendora.com', 'admin123', 'admin'],
    [7, 'Neha Kapoor', 'glowbeauty@vendora.com', 'password123', 'vendor'],
    [8, 'Karan Shah', 'fitlife@vendora.com', 'password123', 'vendor'],
    [9, 'Meera Nair', 'homeessentials@vendora.com', 'password123', 'vendor'],
  ];
  const users = [];
  for (const [user_id, name, email, password, role] of userSeed) {
    users.push({ user_id, name, email, password_hash: await bcrypt.hash(password, SALT_ROUNDS), role, is_active: true });
  }
  await User.insertMany(users);

  await Vendor.insertMany([
    { vendor_id: 1, user_id: 3, shop_name: 'TechGadgets Store', description: 'Electronics and gaming accessories for everyday creators.', status: 'verified' },
    { vendor_id: 2, user_id: 4, shop_name: 'FashionHub Mumbai', description: 'Contemporary clothing and everyday essentials.', status: 'verified' },
    { vendor_id: 3, user_id: 5, shop_name: 'BookWorld India', description: 'Books for learners, professionals, and curious readers.', status: 'verified' },
    { vendor_id: 4, user_id: 7, shop_name: 'GlowBeauty Co.', description: 'Beauty essentials and curated cosmetic sets.', status: 'pending' },
    { vendor_id: 5, user_id: 8, shop_name: 'FitLife Sports', description: 'Accessible home fitness and sports equipment.', status: 'verified' },
    { vendor_id: 6, user_id: 9, shop_name: 'HomeEssentials', description: 'Practical kitchen and home products.', status: 'verified' },
  ]);

  await Category.insertMany([
    { category_id: 1, name: 'Electronics', description: 'Devices, audio, gaming and accessories.', emoji: '📱' },
    { category_id: 2, name: 'Clothing', description: 'Everyday fashion and apparel.', emoji: '👕' },
    { category_id: 3, name: 'Books', description: 'Academic, fiction and professional reading.', emoji: '📚' },
    { category_id: 4, name: 'Home & Kitchen', description: 'Home organization and kitchen essentials.', emoji: '🏠' },
    { category_id: 5, name: 'Sports', description: 'Fitness and sporting goods.', emoji: '🏋️' },
    { category_id: 6, name: 'Beauty', description: 'Cosmetics and personal care.', emoji: '💄' },
    { category_id: 7, name: 'Toys', description: 'Games and creative play.', emoji: '🎮' },
    { category_id: 8, name: 'Organic & Health', description: 'Wellness-oriented products.', emoji: '🌿' },
  ]);

  const productRows = [
    [1,1,1,'Wireless Noise Cancelling Headphones Pro','Hybrid ANC wireless headphones with 40-hour battery.',3499,5999,2,4.70,128],
    [2,1,1,'Mechanical Gaming Keyboard RGB','Hot-swappable mechanical keyboard with RGB backlight.',2199,3500,1,4.55,91],
    [3,2,2,'Premium Cotton Oversized T-Shirt','240 GSM combed cotton oversized tee.',799,1200,45,4.35,64],
    [4,3,3,'Data Structures & Algorithms Cormen','Comprehensive algorithms reference for students and professionals.',649,null,80,4.85,210],
    [5,1,1,'Controller Gamepad PC & Android','Dual-mode wired gamepad for PC and Android.',1299,2100,3,4.25,54],
    [6,4,6,'Matte Liquid Lipstick Set 6 Shades','Long-wear matte lipstick set with six versatile shades.',549,null,22,4.10,37],
    [7,5,5,'Adjustable Resistance Bands Set','Five resistance levels with handles and carry pouch.',899,1500,15,4.50,73],
    [8,6,4,'Non-Stick Cookware Set 5pc','Five-piece induction-compatible cookware starter set.',2999,4200,8,4.40,48],
    [9,1,1,'USB-C 65W GaN Fast Charger','Compact dual-port fast charger for laptops and phones.',1899,2499,18,4.60,102],
    [10,1,1,'Smart Fitness Band AMOLED','AMOLED display fitness tracker with heart-rate monitoring.',2499,3299,12,4.30,85],
    [11,2,2,'Classic Denim Jacket','Mid-wash denim jacket with relaxed unisex fit.',1799,2499,20,4.20,45],
    [12,2,2,'Relaxed Fit Cargo Pants','Six-pocket cotton cargo pants for daily wear.',1299,1799,31,4.15,39],
    [13,2,2,'Everyday Hoodie','Brushed fleece hoodie with ribbed cuffs.',1499,1999,24,4.40,57],
    [14,3,3,'Clean Code Robert C. Martin','Practical principles for readable and maintainable software.',599,799,56,4.75,180],
    [15,3,3,'Atomic Habits','A practical guide to building better habits.',399,599,75,4.80,305],
    [16,3,3,'Designing Data-Intensive Applications','Modern data-system architecture reference.',749,999,34,4.90,144],
    [17,4,6,'Vitamin C Face Serum','Lightweight brightening serum for daily skincare.',699,899,40,4.25,61],
    [18,4,6,'Hydrating Gel Moisturizer','Oil-free hydrating gel moisturizer.',499,699,36,4.20,49],
    [19,5,5,'Yoga Mat 6mm','Anti-slip 6 mm yoga and exercise mat.',799,1099,28,4.45,96],
    [20,5,5,'Neoprene Dumbbell Pair 5kg','Comfort-grip dumbbell pair for home workouts.',1599,2199,9,4.35,52],
    [21,6,4,'Vacuum Storage Bags Pack 8','Reusable space-saving storage bags with hand pump.',749,999,42,4.15,33],
    [22,6,4,'Digital Kitchen Scale','Precision digital scale with tare function.',899,1199,26,4.50,68],
    [23,6,4,'Bamboo Cutting Board Set','Three antibacterial bamboo boards in graduated sizes.',999,1399,17,4.30,41],
    [24,5,5,'Stainless Steel Shaker Bottle','Leak-resistant 750 ml shaker with mixing ball.',449,649,50,4.10,29],
  ];
  await Product.insertMany(productRows.map(([product_id,vendor_id,category_id,name,description,price,original_price,stock_qty,avg_rating,review_count]) => ({
    product_id,vendor_id,category_id,name,description,price,original_price,stock_qty,avg_rating,review_count,is_active:true,
  })));

  await Order.insertMany([
    { order_id: 1, user_id: 1, total_amount: 5698, status: 'delivered' },
    { order_id: 2, user_id: 1, total_amount: 2999, status: 'shipped' },
    { order_id: 3, user_id: 1, total_amount: 1448, status: 'pending' },
  ]);
  await OrderItem.insertMany([
    { item_id: 1, order_id: 1, product_id: 1, vendor_id: 1, quantity: 1, unit_price: 3499 },
    { item_id: 2, order_id: 1, product_id: 2, vendor_id: 1, quantity: 1, unit_price: 2199 },
    { item_id: 3, order_id: 2, product_id: 8, vendor_id: 6, quantity: 1, unit_price: 2999 },
    { item_id: 4, order_id: 3, product_id: 6, vendor_id: 4, quantity: 1, unit_price: 549 },
    { item_id: 5, order_id: 3, product_id: 7, vendor_id: 5, quantity: 1, unit_price: 899 },
  ]);
  await Review.insertMany([
    { review_id: 1, user_id: 1, product_id: 1, rating: 5, comment: 'Strong noise cancellation and comfortable fit.' },
    { review_id: 2, user_id: 2, product_id: 4, rating: 5, comment: 'Very useful reference for algorithm study.' },
  ]);
  await Notification.create({ notification_id: 1, user_id: 1, message: 'Welcome to Vendora. Your demo orders are ready to explore.', is_read: false });

  const counters = { user_id: 9, vendor_id: 6, category_id: 8, product_id: 24, order_id: 3, item_id: 5, cart_id: 0, review_id: 2, notification_id: 1 };
  for (const [key, value] of Object.entries(counters)) await setSequence(key, value);

  await Promise.all([User.syncIndexes(), Vendor.syncIndexes(), Category.syncIndexes(), Product.syncIndexes(), Order.syncIndexes(), OrderItem.syncIndexes(), Cart.syncIndexes(), Review.syncIndexes(), Notification.syncIndexes()]);
  process.stdout.write('Vendora MongoDB database seeded successfully.\n');
  process.stdout.write('Customer: rahul.m@gmail.com / password123\n');
  process.stdout.write('Vendor: arjun.k@gmail.com / password123\n');
  process.stdout.write('Admin: admin@vendora.com / admin123\n');
}

seed()
  .catch((error) => { process.stderr.write(`Seed failed: ${error.stack || error.message}\n`); process.exitCode = 1; })
  .finally(() => closeDatabaseConnection().catch(() => {}));
