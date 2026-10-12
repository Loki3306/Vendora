// @module vendor | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Product, Category } = require('../../models');
const { nextSequence } = require('../../services/id.service');
const { sendSuccess, sendError } = require('../../utils/response');
const { parsePagination } = require('../../utils/pagination');

const esc = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listProducts = asyncHandler(async (req, res) => {
  const { limit, offset, page } = parsePagination(req.query);
  const filter = { vendor_id: req.user.vendor_id };
  const search = String(req.query.search || '').trim();
  if (search) {
    const re = new RegExp(esc(search), 'i');
    filter.$or = [{ name: re }, { description: re }];
  }
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort({ created_at: -1 }).skip(offset).limit(limit).lean();
  const categories = await Category.find({ category_id: { $in: [...new Set(products.map((p) => p.category_id))] } }).lean();
  const cMap = new Map(categories.map((c) => [c.category_id, c]));
  const rows = products.map((p) => ({ ...p, category_name: cMap.get(p.category_id)?.name || '', category_emoji: cMap.get(p.category_id)?.emoji || '' }));
  return sendSuccess(res, rows, 'Vendor products retrieved.', 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

const createProduct = asyncHandler(async (req, res) => {
  const { category_id: categoryId, name, description = '', price, original_price: originalPrice = null, stock_qty: stockQty = 0, is_active: isActive = true } = req.body;
  const category = await Category.findOne({ category_id: Number(categoryId) }).lean();
  if (!category) return sendError(res, 'Category not found.', 400, 'INVALID_REFERENCE');
  const productId = await nextSequence('product_id');
  await Product.create({
    product_id: productId, vendor_id: req.user.vendor_id, category_id: Number(categoryId),
    name: String(name).trim(), description, price: Number(price),
    original_price: originalPrice === null || originalPrice === '' ? null : Number(originalPrice),
    stock_qty: Number(stockQty), is_active: Boolean(isActive),
  });
  return sendSuccess(res, { product_id: productId }, 'Product created.', 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  const product = await Product.findOne({ product_id: productId, vendor_id: req.user.vendor_id });
  if (!product) return sendError(res, 'Product not found.', 404, 'PRODUCT_NOT_FOUND');
  const { category_id: categoryId, name, description, price, original_price: originalPrice, stock_qty: stockQty, is_active: isActive } = req.body;
  if (categoryId !== undefined) {
    const category = await Category.findOne({ category_id: Number(categoryId) }).lean();
    if (!category) return sendError(res, 'Category not found.', 400, 'INVALID_REFERENCE');
    product.category_id = Number(categoryId);
  }
  if (name !== undefined) product.name = String(name).trim();
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (originalPrice !== undefined) product.original_price = originalPrice === null || originalPrice === '' ? null : Number(originalPrice);
  if (stockQty !== undefined) product.stock_qty = Number(stockQty);
  if (isActive !== undefined) product.is_active = Boolean(isActive);
  if ([categoryId, name, description, price, originalPrice, stockQty, isActive].every((v) => v === undefined)) {
    return sendError(res, 'No fields supplied for update.', 422, 'VALIDATION_ERROR');
  }
  await product.save();
  return sendSuccess(res, { product_id: productId }, 'Product updated.');
});

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await Product.updateOne({ product_id: Number(req.params.id), vendor_id: req.user.vendor_id }, { $set: { is_active: false } });
  if (!result.matchedCount) return sendError(res, 'Product not found.', 404, 'PRODUCT_NOT_FOUND');
  return sendSuccess(res, null, 'Product archived.');
});

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };
