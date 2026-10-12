// @module customer | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Cart, Product, Vendor, Order, OrderItem } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/response');
const { parsePagination } = require('../../utils/pagination');
const { createNotification } = require('../../services/notification.service');
const { nextSequence } = require('../../services/id.service');

const validationError = (message) => Object.assign(new Error(message), { name: 'ValidationError' });

async function hydrateOrders(orders) {
  if (!orders.length) return [];
  const orderIds = orders.map((o) => o.order_id);
  const items = await OrderItem.find({ order_id: { $in: orderIds } }).sort({ item_id: 1 }).lean();
  const products = await Product.find({ product_id: { $in: [...new Set(items.map((i) => i.product_id))] } }).lean();
  const vendors = await Vendor.find({ vendor_id: { $in: [...new Set(items.map((i) => i.vendor_id))] } }).lean();
  const pMap = new Map(products.map((p) => [p.product_id, p]));
  const vMap = new Map(vendors.map((v) => [v.vendor_id, v]));
  const itemMap = new Map();
  for (const item of items) {
    if (!itemMap.has(item.order_id)) itemMap.set(item.order_id, []);
    itemMap.get(item.order_id).push({
      item_id: item.item_id,
      product_id: item.product_id,
      product_name: pMap.get(item.product_id)?.name || 'Product',
      vendor_id: item.vendor_id,
      shop_name: vMap.get(item.vendor_id)?.shop_name || 'Vendor',
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: Number((item.unit_price * item.quantity).toFixed(2)),
    });
  }
  return orders.map((o) => ({
    order_id: o.order_id,
    total_amount: o.total_amount,
    status: o.status,
    created_at: o.created_at,
    updated_at: o.updated_at,
    items: itemMap.get(o.order_id) || [],
  }));
}

const placeOrder = asyncHandler(async (req, res) => {
  const requested = Array.isArray(req.body.items) ? req.body.items : [];
  let items = requested;
  if (!items.length) items = await Cart.find({ user_id: req.user.user_id }, { product_id: 1, quantity: 1, _id: 0 }).lean();
  if (!items.length) return sendError(res, 'Your cart is empty.', 422, 'EMPTY_ORDER');

  const merged = new Map();
  for (const item of items) {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(quantity) || quantity < 1) {
      throw validationError('Order items require valid product_id and quantity values.');
    }
    merged.set(productId, (merged.get(productId) || 0) + quantity);
  }
  items = [...merged.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));

  const products = await Product.find({ product_id: { $in: items.map((i) => i.product_id) } }).lean();
  const pMap = new Map(products.map((p) => [p.product_id, p]));
  const vendors = await Vendor.find({ vendor_id: { $in: [...new Set(products.map((p) => p.vendor_id))] } }).lean();
  const vMap = new Map(vendors.map((v) => [v.vendor_id, v]));
  const resolved = [];
  let total = 0;
  for (const item of items) {
    const product = pMap.get(item.product_id);
    const vendor = product ? vMap.get(product.vendor_id) : null;
    if (!product || !product.is_active || !vendor || vendor.status !== 'verified') throw validationError(`Product ${item.product_id} is unavailable.`);
    if (product.stock_qty < item.quantity) throw validationError(`Insufficient stock for ${product.name}.`);
    total += product.price * item.quantity;
    resolved.push({ ...product, vendor_user_id: vendor.user_id, quantity: item.quantity });
  }

  const decremented = [];
  let orderId = null;
  try {
    for (const item of resolved) {
      const updated = await Product.findOneAndUpdate(
        { product_id: item.product_id, is_active: true, stock_qty: { $gte: item.quantity } },
        { $inc: { stock_qty: -item.quantity } },
        { new: true },
      ).lean();
      if (!updated) throw validationError(`Insufficient stock for ${item.name}.`);
      decremented.push({ product_id: item.product_id, quantity: item.quantity });
    }

    orderId = await nextSequence('order_id');
    await Order.create({ order_id: orderId, user_id: req.user.user_id, total_amount: Number(total.toFixed(2)), status: 'pending' });
    const itemDocs = [];
    const vendorMessages = new Map();
    for (const item of resolved) {
      itemDocs.push({
        item_id: await nextSequence('item_id'), order_id: orderId, product_id: item.product_id,
        vendor_id: item.vendor_id, quantity: item.quantity, unit_price: item.price,
      });
      vendorMessages.set(item.vendor_user_id, `New order #${orderId} received for ${item.name}.`);
    }
    await OrderItem.insertMany(itemDocs);
    await Cart.deleteMany({ user_id: req.user.user_id, product_id: { $in: resolved.map((i) => i.product_id) } });
    await createNotification(req.user.user_id, `Order #${orderId} placed successfully.`);
    for (const [vendorUserId, message] of vendorMessages.entries()) await createNotification(vendorUserId, message);
    return sendSuccess(res, { order_id: orderId, total_amount: Number(total.toFixed(2)), status: 'pending' }, 'Order placed successfully.', 201);
  } catch (error) {
    for (const item of decremented) {
      await Product.updateOne({ product_id: item.product_id }, { $inc: { stock_qty: item.quantity } }).catch(() => {});
    }
    if (orderId !== null) {
      await OrderItem.deleteMany({ order_id: orderId }).catch(() => {});
      await Order.deleteOne({ order_id: orderId }).catch(() => {});
    }
    throw error;
  }
});

const listOrders = asyncHandler(async (req, res) => {
  const { limit, offset, page } = parsePagination(req.query);
  const filter = { user_id: req.user.user_id };
  if (req.query.status) filter.status = req.query.status;
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort({ created_at: -1 }).skip(offset).limit(limit).lean();
  return sendSuccess(res, await hydrateOrders(orders), 'Orders retrieved.', 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ order_id: Number(req.params.order_id), user_id: req.user.user_id }).lean();
  if (!order) return sendError(res, 'Order not found.', 404, 'ORDER_NOT_FOUND');
  const [hydrated] = await hydrateOrders([order]);
  return sendSuccess(res, hydrated, 'Order retrieved.');
});

module.exports = { placeOrder, listOrders, trackOrder };
