// @module customer | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../utils/asyncHandler');
const { Product, Vendor, Category, Review, User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');

const esc = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const discount = (p) => p.original_price && p.original_price > p.price
  ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0;

async function enrichProducts(products) {
  const vendorIds = [...new Set(products.map((p) => p.vendor_id))];
  const categoryIds = [...new Set(products.map((p) => p.category_id))];
  const vendors = await Vendor.find({ vendor_id: { $in: vendorIds } }).lean();
  const categories = await Category.find({ category_id: { $in: categoryIds } }).lean();
  const vMap = new Map(vendors.map((v) => [v.vendor_id, v]));
  const cMap = new Map(categories.map((c) => [c.category_id, c]));
  return products.map((p) => ({
    ...p,
    shop_name: vMap.get(p.vendor_id)?.shop_name || '',
    category_name: cMap.get(p.category_id)?.name || '',
    category_emoji: cMap.get(p.category_id)?.emoji || '',
    discount_percent: discount(p),
  }));
}

const listProducts = asyncHandler(async (req, res) => {
  const { limit, offset, page } = parsePagination(req.query);
  const verified = await Vendor.find({ status: 'verified' }, { vendor_id: 1, shop_name: 1, _id: 0 }).lean();
  const verifiedIds = verified.map((v) => v.vendor_id);
  const filter = { is_active: true, vendor_id: { $in: verifiedIds } };
  if (req.query.category_id) filter.category_id = Number(req.query.category_id);
  if (req.query.vendor_id) {
    const requestedVendorId = Number(req.query.vendor_id);
    filter.vendor_id = verifiedIds.includes(requestedVendorId) ? requestedVendorId : -1;
  }
  if (req.query.min_rating) filter.avg_rating = { ...(filter.avg_rating || {}), $gte: Number(req.query.min_rating) };
  if (req.query.min_price) filter.price = { ...(filter.price || {}), $gte: Number(req.query.min_price) };
  if (req.query.max_price) filter.price = { ...(filter.price || {}), $lte: Number(req.query.max_price) };
  if (req.query.in_stock === 'true' || req.query.in_stock === '1') filter.stock_qty = { $gt: 0 };
  if (req.query.in_stock === 'false' || req.query.in_stock === '0') filter.stock_qty = 0;
  if (req.query.search) {
    const re = new RegExp(esc(req.query.search), 'i');
    const matchingVendorIds = verified.filter((v) => re.test(v.shop_name)).map((v) => v.vendor_id);
    filter.$or = [{ name: re }, { description: re }, { vendor_id: { $in: matchingVendorIds } }];
  }
  const sortMap = { price: 'price', rating: 'avg_rating', newest: 'created_at', name: 'name' };
  const sortField = sortMap[req.query.sort] || 'created_at';
  const sortDir = String(req.query.order || 'desc').toLowerCase() === 'asc' ? 1 : -1;
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort({ [sortField]: sortDir }).skip(offset).limit(limit).lean();
  const rows = await enrichProducts(products);
  return sendSuccess(res, rows, 'Products retrieved.', 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ category_id: 1 }).lean();
  const counts = await Product.aggregate([
    { $match: { is_active: true } },
    { $group: { _id: '$category_id', product_count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((x) => [x._id, x.product_count]));
  return sendSuccess(res, categories.map((c) => ({ ...c, product_count: countMap.get(c.category_id) || 0 })), 'Categories retrieved.');
});

const listVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ status: 'verified' }).sort({ shop_name: 1 }).lean();
  const counts = await Product.aggregate([
    { $match: { is_active: true, vendor_id: { $in: vendors.map((v) => v.vendor_id) } } },
    { $group: { _id: '$vendor_id', product_count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((x) => [x._id, x.product_count]));
  return sendSuccess(res, vendors.map((v) => ({ vendor_id: v.vendor_id, shop_name: v.shop_name, product_count: countMap.get(v.vendor_id) || 0 })), 'Vendors retrieved.');
});

const getProduct = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  const product = await Product.findOne({ product_id: productId, is_active: true }).lean();
  if (!product) return sendError(res, 'Product not found.', 404, 'PRODUCT_NOT_FOUND');
  const vendor = await Vendor.findOne({ vendor_id: product.vendor_id, status: 'verified' }).lean();
  if (!vendor) return sendError(res, 'Product not found.', 404, 'PRODUCT_NOT_FOUND');
  const category = await Category.findOne({ category_id: product.category_id }).lean();
  const reviews = await Review.find({ product_id: productId }).sort({ created_at: -1 }).limit(5).lean();
  const users = await User.find({ user_id: { $in: reviews.map((r) => r.user_id) } }, { user_id: 1, name: 1, _id: 0 }).lean();
  const userMap = new Map(users.map((u) => [u.user_id, u.name]));
  const reviewRows = reviews.map((r) => ({ review_id: r.review_id, rating: r.rating, comment: r.comment, created_at: r.created_at, reviewer_name: userMap.get(r.user_id) || 'Vendora User' }));
  return sendSuccess(res, {
    ...product,
    shop_name: vendor.shop_name,
    category_name: category?.name || '',
    category_emoji: category?.emoji || '',
    discount_percent: discount(product),
    reviews: reviewRows,
  }, 'Product retrieved.');
});

module.exports = { listProducts, getProduct, listCategories, listVendors };
