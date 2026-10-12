// @module vendor | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Product, Category, Order, OrderItem } = require('../../models');
const { sendSuccess } = require('../../utils/response');

const getAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.user.vendor_id;
  const items = await OrderItem.find({ vendor_id: vendorId }).lean();
  const orderIds = [...new Set(items.map((i) => i.order_id))];
  const orders = await Order.find({ order_id: { $in: orderIds } }).lean();
  const orderMap = new Map(orders.map((o) => [o.order_id, o]));
  const productCount = await Product.countDocuments({ vendor_id: vendorId, is_active: true });
  const orderCount = orders.length;
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;
  const deliveredItems = items.filter((i) => orderMap.get(i.order_id)?.status === 'delivered');
  const revenue = deliveredItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const conversionRate = productCount ? Math.min(100, (orderCount / productCount) * 100) : 0;
  const returnRate = orderCount ? (cancelledOrders / orderCount) * 100 : 0;

  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  const dailyMap = new Map();
  for (const item of deliveredItems) {
    const order = orderMap.get(item.order_id);
    if (!order || order.updated_at < cutoff) continue;
    const day = order.updated_at.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + item.quantity * item.unit_price);
  }
  const dailyRevenue = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, value]) => ({ day, revenue: Number(value.toFixed(2)) }));

  const products = await Product.find({ product_id: { $in: [...new Set(deliveredItems.map((i) => i.product_id))] } }).lean();
  const pMap = new Map(products.map((p) => [p.product_id, p]));
  const productAgg = new Map();
  for (const item of deliveredItems) {
    if (!productAgg.has(item.product_id)) productAgg.set(item.product_id, { product_id: item.product_id, name: pMap.get(item.product_id)?.name || 'Product', revenue: 0, units_sold: 0 });
    const row = productAgg.get(item.product_id); row.revenue += item.quantity * item.unit_price; row.units_sold += item.quantity;
  }
  const topProducts = [...productAgg.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((x) => ({ ...x, revenue: Number(x.revenue.toFixed(2)) }));

  const categories = await Category.find({ category_id: { $in: [...new Set(products.map((p) => p.category_id))] } }).lean();
  const cMap = new Map(categories.map((c) => [c.category_id, c]));
  const categoryAgg = new Map();
  for (const item of deliveredItems) {
    const product = pMap.get(item.product_id); if (!product) continue;
    if (!categoryAgg.has(product.category_id)) categoryAgg.set(product.category_id, { category_id: product.category_id, name: cMap.get(product.category_id)?.name || 'Category', revenue: 0 });
    categoryAgg.get(product.category_id).revenue += item.quantity * item.unit_price;
  }
  const categorySplit = [...categoryAgg.values()].sort((a, b) => b.revenue - a.revenue).map((x) => ({ ...x, revenue: Number(x.revenue.toFixed(2)) }));
  const avgOrderValue = orderCount ? revenue / orderCount : 0;
  return sendSuccess(res, {
    conversion_rate: Number(conversionRate.toFixed(2)),
    conversion_rate_note: 'Proxy: distinct orders per active catalog item; exact product-view conversion requires a dedicated analytics event collection.',
    avg_order_value: Number(avgOrderValue.toFixed(2)),
    return_rate: Number(returnRate.toFixed(2)),
    daily_revenue: dailyRevenue,
    top_products_by_revenue: topProducts,
    category_revenue_split: categorySplit,
  }, 'Vendor analytics retrieved.');
});

module.exports = { getAnalytics };
