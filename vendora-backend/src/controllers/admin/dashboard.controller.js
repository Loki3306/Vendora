// @module admin | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { User, Vendor, Product, Order } = require('../../models');
const { sendSuccess } = require('../../utils/response');

const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [totalUsers, totalVendors, totalProducts, todayOrders, pendingVendorApprovals, todayOrderDocs] = await Promise.all([
    User.countDocuments(), Vendor.countDocuments(), Product.countDocuments({ is_active: true }),
    Order.countDocuments({ created_at: { $gte: startToday } }), Vendor.countDocuments({ status: 'pending' }),
    Order.find({ created_at: { $gte: startToday }, status: { $ne: 'cancelled' } }).lean(),
  ]);
  const todayRevenue = todayOrderDocs.reduce((sum, o) => sum + o.total_amount, 0);
  const cutoff = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const delivered = await Order.find({ status: 'delivered', updated_at: { $gte: cutoff } }).lean();
  const monthlyMap = new Map();
  for (const o of delivered) {
    const key = `${o.updated_at.getFullYear()}-${String(o.updated_at.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap.has(key)) monthlyMap.set(key, { month_key: key, month: o.updated_at.toLocaleString('en-US', { month: 'short' }), revenue: 0 });
    monthlyMap.get(key).revenue += o.total_amount;
  }
  const monthlyRevenue = [...monthlyMap.values()].sort((a, b) => a.month_key.localeCompare(b.month_key)).map((x) => ({ ...x, revenue: Number(x.revenue.toFixed(2)) }));
  const [orders, users, vendors] = await Promise.all([
    Order.find().sort({ updated_at: -1 }).limit(10).lean(),
    User.find().sort({ created_at: -1 }).limit(10).lean(),
    Vendor.find().sort({ created_at: -1 }).limit(10).lean(),
  ]);
  const activity = [
    ...orders.map((o) => ({ message: `Order #${o.order_id} ${o.status}`, event_type: 'order', event_date: o.updated_at })),
    ...users.map((u) => ({ message: `User ${u.name} joined Vendora`, event_type: 'user', event_date: u.created_at })),
    ...vendors.map((v) => ({ message: `Vendor ${v.shop_name} is ${v.status}`, event_type: 'vendor', event_date: v.created_at })),
  ].sort((a, b) => b.event_date - a.event_date).slice(0, 10);
  return sendSuccess(res, {
    total_users: totalUsers, total_vendors: totalVendors, total_products: totalProducts,
    today_orders: todayOrders, today_revenue: Number(todayRevenue.toFixed(2)),
    pending_vendor_approvals: pendingVendorApprovals,
    monthly_revenue: monthlyRevenue, recent_activity: activity,
  }, 'Admin dashboard retrieved.');
});

module.exports = { getDashboard };
