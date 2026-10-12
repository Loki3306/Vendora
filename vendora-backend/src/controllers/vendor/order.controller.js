// @module vendor | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Order, OrderItem, Product, User } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/response');
const { createNotification } = require('../../services/notification.service');

const getOrders = asyncHandler(async (req, res) => {
  const vendorItems = await OrderItem.find({ vendor_id: req.user.vendor_id }).sort({ item_id: 1 }).lean();
  const orderIds = [...new Set(vendorItems.map((i) => i.order_id))];
  const orderFilter = { order_id: { $in: orderIds } };
  if (req.query.status) orderFilter.status = req.query.status;
  const orders = await Order.find(orderFilter).sort({ created_at: -1 }).lean();
  const allowed = new Set(orders.map((o) => o.order_id));
  const items = vendorItems.filter((i) => allowed.has(i.order_id));
  const products = await Product.find({ product_id: { $in: [...new Set(items.map((i) => i.product_id))] } }).lean();
  const users = await User.find({ user_id: { $in: [...new Set(orders.map((o) => o.user_id))] } }).lean();
  const pMap = new Map(products.map((p) => [p.product_id, p]));
  const uMap = new Map(users.map((u) => [u.user_id, u]));
  const itemMap = new Map();
  for (const item of items) {
    if (!itemMap.has(item.order_id)) itemMap.set(item.order_id, []);
    itemMap.get(item.order_id).push({
      item_id: item.item_id, product_id: item.product_id, product_name: pMap.get(item.product_id)?.name || 'Product',
      quantity: item.quantity, unit_price: item.unit_price, line_total: Number((item.quantity * item.unit_price).toFixed(2)),
    });
  }
  const rows = orders.map((o) => {
    const customer = uMap.get(o.user_id) || {};
    const orderItems = itemMap.get(o.order_id) || [];
    return {
      order_id: o.order_id, status: o.status, created_at: o.created_at,
      customer_name: customer.name || '', customer_email: customer.email || '',
      items: orderItems,
      vendor_total: Number(orderItems.reduce((sum, i) => sum + i.line_total, 0).toFixed(2)),
    };
  });
  return sendSuccess(res, rows, 'Vendor orders retrieved.');
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = Number(req.params.order_id);
  const nextStatus = req.body.status;
  const progression = ['pending', 'processing', 'shipped', 'delivered'];
  const owns = await OrderItem.exists({ order_id: orderId, vendor_id: req.user.vendor_id });
  if (!owns) return sendError(res, 'Order not found for this vendor.', 404, 'ORDER_NOT_FOUND');
  const order = await Order.findOne({ order_id: orderId });
  if (!order) return sendError(res, 'Order not found for this vendor.', 404, 'ORDER_NOT_FOUND');
  const currentIndex = progression.indexOf(order.status);
  const nextIndex = progression.indexOf(nextStatus);
  if (currentIndex < 0 || nextIndex !== currentIndex + 1) {
    return sendError(res, `Order can only progress from ${order.status} to ${progression[currentIndex + 1] || 'no further status'}.`, 409, 'INVALID_STATUS_TRANSITION');
  }
  order.status = nextStatus;
  await order.save();
  await createNotification(order.user_id, `Order #${orderId} status updated to ${nextStatus}.`);
  return sendSuccess(res, { order_id: orderId, status: nextStatus }, 'Order status updated.');
});

module.exports = { getOrders, updateOrderStatus };
