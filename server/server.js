require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, Product } = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
// Body parser except for Stripe webhook (needs raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/orders/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/', (req, res) => res.send('Monkey Shoes API is running'));

// Sync database and seed products if necessary
const seedProducts = async () => {
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate([
      { name: 'Banana Boots', price: 49.99, image: 'https://placehold.co/300x300' },
      { name: 'Jungle Joggers', price: 59.99, image: 'https://placehold.co/300x300' },
      { name: 'Tree Top Trainers', price: 69.99, image: 'https://placehold.co/300x300' },
    ]);
    console.log('Seeded default products');
  }
};

(async () => {
  try {
    await sequelize.sync();
    await seedProducts();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
  }
})();