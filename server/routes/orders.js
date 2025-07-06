const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key');
const { Product, Order, OrderItem } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Checkout – create Stripe session
router.post('/checkout', auth, async (req, res) => {
  const { items } = req.body; // [{productId, qty}]
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Fetch products from DB
    const products = await Product.findAll({ where: { id: items.map(i => i.productId) } });

    const lineItems = [];
    let total = 0;
    products.forEach(p => {
      const cartItem = items.find(i => i.productId === p.id);
      const quantity = cartItem?.qty || 1;
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: p.name, images: [p.image] },
          unit_amount: Math.round(p.price * 100),
        },
        quantity,
      });
      total += p.price * quantity;
    });

    // create order record pending
    const order = await Order.create({ userId: req.user.id, total, status: 'pending' });
    for (const p of products) {
      const cartItem = items.find(i => i.productId === p.id);
      await OrderItem.create({ OrderId: order.id, ProductId: p.id, quantity: cartItem.qty || 1, price: p.price });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5500'}/cart.html?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5500'}/cart.html?canceled=true`,
      metadata: { orderId: order.id.toString() },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout error' });
  }
});

// Stripe webhook (raw body parser should be configured in server.js)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    try {
      const order = await Order.findByPk(orderId);
      if (order) {
        order.status = 'paid';
        await order.save();
      }
    } catch (err) {
      console.error('Error updating order', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;