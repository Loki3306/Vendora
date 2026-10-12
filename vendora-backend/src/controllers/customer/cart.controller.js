// @module customer | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Cart, Product, Vendor } = require('../../models');
const { nextSequence } = require('../../services/id.service');
const { sendSuccess, sendError } = require('../../utils/response');

const getCart = asyncHandler(async (req, res) => {
  const carts = await Cart.find({ user_id: req.user.user_id }).sort({ created_at: -1 }).lean();
  const products = await Product.find({ product_id: { $in: carts.map((c) => c.product_id) } }).lean();
  const vendors = await Vendor.find({ vendor_id: { $in: products.map((p) => p.vendor_id) } }).lean();
  const pMap = new Map(products.map((p) => [p.product_id, p]));
  const vMap = new Map(vendors.map((v) => [v.vendor_id, v]));
  const rows = carts.map((c) => {
    const p = pMap.get(c.product_id);
    if (!p) return null;
    return {
      cart_id: c.cart_id, quantity: c.quantity, created_at: c.created_at,
      product_id: p.product_id, name: p.name, price: p.price, original_price: p.original_price,
      stock_qty: p.stock_qty, category_id: p.category_id, shop_name: vMap.get(p.vendor_id)?.shop_name || '',
      line_total: Number((p.price * c.quantity).toFixed(2)),
    };
  }).filter(Boolean);
  const subtotal = rows.reduce((sum, row) => sum + Number(row.line_total), 0);
  return sendSuccess(res, { items: rows, subtotal: Number(subtotal.toFixed(2)) }, 'Cart retrieved.');
});

const addToCart = asyncHandler(async (req, res) => {
  const productId = Number(req.body.product_id);
  const quantity = Math.max(1, Number(req.body.quantity || 1));
  const product = await Product.findOne({ product_id: productId, is_active: true }).lean();
  if (!product) return sendError(res, 'Product is unavailable.', 404, 'PRODUCT_NOT_FOUND');
  const vendor = await Vendor.findOne({ vendor_id: product.vendor_id, status: 'verified' }).lean();
  if (!vendor) return sendError(res, 'Product is unavailable.', 404, 'PRODUCT_NOT_FOUND');
  const existing = await Cart.findOne({ user_id: req.user.user_id, product_id: productId });
  const resultingQty = (existing?.quantity || 0) + quantity;
  if (product.stock_qty < resultingQty) return sendError(res, 'Requested quantity exceeds available stock.', 409, 'INSUFFICIENT_STOCK');
  if (existing) {
    existing.quantity = resultingQty;
    await existing.save();
  } else {
    const cartId = await nextSequence('cart_id');
    await Cart.create({ cart_id: cartId, user_id: req.user.user_id, product_id: productId, quantity });
  }
  return sendSuccess(res, null, 'Product added to cart.', 201);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const cartId = Number(req.params.cart_id);
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) return sendError(res, 'Quantity must be zero or a positive integer.', 422, 'VALIDATION_ERROR');
  const cart = await Cart.findOne({ cart_id: cartId, user_id: req.user.user_id });
  if (!cart) return sendError(res, 'Cart item not found.', 404, 'CART_ITEM_NOT_FOUND');
  if (quantity === 0) {
    await Cart.deleteOne({ cart_id: cartId, user_id: req.user.user_id });
    return sendSuccess(res, null, 'Cart item removed.');
  }
  const product = await Product.findOne({ product_id: cart.product_id }).lean();
  if (!product || product.stock_qty < quantity) return sendError(res, 'Requested quantity exceeds available stock.', 409, 'INSUFFICIENT_STOCK');
  cart.quantity = quantity;
  await cart.save();
  return sendSuccess(res, { cart_id: cartId, quantity }, 'Cart quantity updated.');
});

const removeFromCart = asyncHandler(async (req, res) => {
  const result = await Cart.deleteOne({ cart_id: Number(req.params.cart_id), user_id: req.user.user_id });
  if (!result.deletedCount) return sendError(res, 'Cart item not found.', 404, 'CART_ITEM_NOT_FOUND');
  return sendSuccess(res, null, 'Cart item removed.');
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
