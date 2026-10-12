// @module vendor | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Product, Order, OrderItem, User } = require('../../models');
const { sendSuccess } = require('../../utils/response');

const getDashboard = asyncHandler(async (req, res) => {
  const vendorId = req.user.vendor_id;
  const products = await Product.find({ vendor_id: vendorId, is_active: true }).lean();
  const lowStock = products.filter((p) => p.stock_qty <= 5).sort((a, b) => a.stock_qty - b.stock_qty || a.name.localeCompare(b.name)).slice(0, 8)
    .map((p) => ({ product_id: p.product_id, name: p.name, stock_qty: p.stock_qty, price: p.price }));
  const items = await OrderItem.find({ vendor_id: vendorId }).lean();
  const orderIds = [...new Set(items.map((i) => i.order_id))];
  const orders = await Order.find({ order_id: { $in: orderIds } }).lean();
  const orderMap = new Map(orders.map((o) => [o.order_id, o]));
  const activeOrders = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length;
  let totalRevenue = 0;
  let revenueThisMonth = 0;
  const now = new Date();
  const monthlyMap = new Map();
  for (const item of items) {
    const order = orderMap.get(item.order_id);
    if (!order || order.status !== 'delivered') continue;
    const value = item.quantity * item.unit_price;
    totalRevenue += value;
    if (order.updated_at.getFullYear() === now.getFullYear() && order.updated_at.getMonth() === now.getMonth()) revenueThisMonth += value;
    const monthKey = `${order.updated_at.getFullYear()}-${String(order.updated_at.getMonth() + 1).padStart(2, '0')}`;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    if (order.updated_at >= cutoff) {
      if (!monthlyMap.has(monthKey)) monthlyMap.set(monthKey, { month_key: monthKey, month: order.updated_at.toLocaleString('en-US', { month: 'short' }), revenue: 0 });
      monthlyMap.get(monthKey).revenue += value;
    }
  }
  const recent = [...orders].sort((a, b) => b.created_at - a.created_at).slice(0, 5);
  const users = await User.find({ user_id: { $in: recent.map((o) => o.user_id) } }).lean();
  const uMap = new Map(users.map((u) => [u.user_id, u]));
  const recentOrders = recent.map((o) => {
    const ownItems = items.filter((i) => i.order_id === o.order_id);
    return {
      order_id: o.order_id, status: o.status, created_at: o.created_at,
      customer_name: uMap.get(o.user_id)?.name || '',
      vendor_total: Number(ownItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0).toFixed(2)),
      item_count: ownItems.reduce((sum, i) => sum + i.quantity, 0),
    };
  });
  const monthly = [...monthlyMap.values()].sort((a, b) => a.month_key.localeCompare(b.month_key)).map((x) => ({ ...x, revenue: Number(x.revenue.toFixed(2)) }));
  return sendSuccess(res, {
    total_products: products.length,
    active_orders: activeOrders,
    total_revenue: Number(totalRevenue.toFixed(2)),
    revenue_this_month: Number(revenueThisMonth.toFixed(2)),
    low_stock_count: products.filter((p) => p.stock_qty <= 5).length,
    low_stock_products: lowStock,
    monthly_revenue: monthly,
    recent_orders: recentOrders,
  }, 'Vendor dashboard retrieved.');
});

module.exports = { getDashboard };
