// @module admin | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
const asyncHandler = require('../../utils/asyncHandler');
const { Category, Product } = require('../../models');
const { nextSequence } = require('../../services/id.service');
const { sendSuccess, sendError } = require('../../utils/response');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  const counts = await Product.aggregate([{ $group: { _id: '$category_id', product_count: { $sum: 1 } } }]);
  const cMap = new Map(counts.map((x) => [x._id, x.product_count]));
  return sendSuccess(res, categories.map((c) => ({ ...c, product_count: cMap.get(c.category_id) || 0 })), 'Categories retrieved.');
});

const createCategory = asyncHandler(async (req, res) => {
  const categoryId = await nextSequence('category_id');
  await Category.create({ category_id: categoryId, name: String(req.body.name).trim(), description: req.body.description || '', emoji: req.body.emoji || '' });
  return sendSuccess(res, { category_id: categoryId }, 'Category created.', 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const update = {};
  for (const key of ['name', 'description', 'emoji']) if (req.body[key] !== undefined) update[key] = key === 'name' ? String(req.body[key]).trim() : req.body[key];
  if (!Object.keys(update).length) return sendError(res, 'No fields supplied for update.', 422, 'VALIDATION_ERROR');
  const result = await Category.updateOne({ category_id: id }, { $set: update });
  if (!result.matchedCount) return sendError(res, 'Category not found.', 404, 'CATEGORY_NOT_FOUND');
  return sendSuccess(res, { category_id: id }, 'Category updated.');
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (await Product.exists({ category_id: id })) return sendError(res, 'Category has products and cannot be deleted.', 409, 'CATEGORY_HAS_PRODUCTS');
  const result = await Category.deleteOne({ category_id: id });
  if (!result.deletedCount) return sendError(res, 'Category not found.', 404, 'CATEGORY_NOT_FOUND');
  return sendSuccess(res, null, 'Category deleted.');
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
