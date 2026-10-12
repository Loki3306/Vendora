// @module api | Vendora v1.0 | SPIT Mini Project AY 2026-27
const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./customer/cart.routes');
const orderRoutes = require('./customer/order.routes');
const notificationRoutes = require('./customer/notification.routes');
const vendorDashboardRoutes = require('./vendor/dashboard.routes');
const vendorProductRoutes = require('./vendor/product.routes');
const vendorOrderRoutes = require('./vendor/order.routes');
const vendorAnalyticsRoutes = require('./vendor/analytics.routes');
const adminDashboardRoutes = require('./admin/dashboard.routes');
const adminUserRoutes = require('./admin/user.routes');
const adminVendorRoutes = require('./admin/vendor.routes');
const adminCategoryRoutes = require('./admin/category.routes');
const adminReportRoutes = require('./admin/report.routes');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/customer/cart', cartRoutes);
router.use('/customer/orders', orderRoutes);
router.use('/customer/notifications', notificationRoutes);
router.use('/vendor', vendorDashboardRoutes, vendorProductRoutes, vendorOrderRoutes, vendorAnalyticsRoutes);
router.use('/admin', adminDashboardRoutes, adminUserRoutes, adminVendorRoutes, adminCategoryRoutes, adminReportRoutes);
module.exports = router;
