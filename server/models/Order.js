const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  total: { type: DataTypes.FLOAT, allowNull: false },
  stripeSessionId: { type: DataTypes.STRING },
});

module.exports = Order;