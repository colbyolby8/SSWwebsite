const express = require('express');
const { Product } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;