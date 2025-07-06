const sequelize = require('../db');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
User.hasMany(Order);
Order.belongsTo(User);

Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};