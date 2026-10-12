// @module admin | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Vendor, Order, OrderItem } = require('../../models');
const { sendSuccess } = require('../../utils/response');

function dateFilter(query) {
  const created_at = {};
  if (query.start_date) created_at.$gte = new Date(`${query.start_date}T00:00:00`);
  if (query.end_date) created_at.$lte = new Date(`${query.end_date}T23:59:59.999`);
  return Object.keys(created_at).length ? created_at : null;
}

const getReports = asyncHandler(async (req, res) => {
  const orderFilter = { status: { $ne: 'cancelled' } };
  const range = dateFilter(req.query); if (range) orderFilter.created_at = range;
  const orders = await Order.find(orderFilter).lean();
  const orderMap = new Map(orders.map((o) => [o.order_id, o]));
  const itemFilter = { order_id: { $in: orders.map((o) => o.order_id) } };
  if (req.query.vendor_id) itemFilter.vendor_id = Number(req.query.vendor_id);
  const items = await OrderItem.find(itemFilter).lean();
  const gross = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const relevantOrderIds = new Set(items.map((i) => i.order_id));
  const totalOrders = relevantOrderIds.size;
  const totalProductsSold = items.reduce((sum, i) => sum + i.quantity, 0);
  const summary = {
    gross_revenue: Number(gross.toFixed(2)), total_orders: totalOrders,
    total_products_sold: totalProductsSold,
    avg_order_value: totalOrders ? Number((gross / totalOrders).toFixed(2)) : 0,
  };
  const vendors = await Vendor.find({ vendor_id: { $in: [...new Set(items.map((i) => i.vendor_id))] } }).lean();
  const vMap = new Map(vendors.map((v) => [v.vendor_id, v]));
  const byVendorMap = new Map();
  const byMonthMap = new Map();
  for (const item of items) {
    const value = item.quantity * item.unit_price;
    if (!byVendorMap.has(item.vendor_id)) byVendorMap.set(item.vendor_id, { vendor_id: item.vendor_id, shop_name: vMap.get(item.vendor_id)?.shop_name || 'Vendor', revenue: 0, units_sold: 0 });
    const vr = byVendorMap.get(item.vendor_id); vr.revenue += value; vr.units_sold += item.quantity;
    const order = orderMap.get(item.order_id); if (!order) continue;
    const key = `${order.created_at.getFullYear()}-${String(order.created_at.getMonth() + 1).padStart(2, '0')}|${item.vendor_id}`;
    if (!byMonthMap.has(key)) byMonthMap.set(key, {
      month_key: key.slice(0, 7), month: order.created_at.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      shop_name: vMap.get(item.vendor_id)?.shop_name || 'Vendor', revenue: 0,
    });
    byMonthMap.get(key).revenue += value;
  }
  const byVendor = [...byVendorMap.values()].sort((a, b) => b.revenue - a.revenue).map((x) => ({
    ...x, revenue: Number(x.revenue.toFixed(2)), share_percent: gross ? Number(((x.revenue / gross) * 100).toFixed(2)) : 0,
  }));
  const byMonth = [...byMonthMap.values()].sort((a, b) => a.month_key.localeCompare(b.month_key)).map((x) => ({ ...x, revenue: Number(x.revenue.toFixed(2)) }));
  return sendSuccess(res, { summary, by_vendor: byVendor, by_month: byMonth }, 'Sales report generated.');
});

module.exports = { getReports };
