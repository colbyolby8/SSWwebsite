# Monkey Shoes Website

A playful single-page website showcasing premium footwear designed for adventurous primates.

## Getting Started

1. Clone/download this repository.
2. Open `index.html` in any modern web browser.

No build step or additional dependencies are required – everything is pure HTML/CSS/JavaScript.

## File Structure

- `index.html` – Main landing page
- `styles.css`  – Styling and layout
- `script.js`   – Basic client-side interactivity (demo-level)

## Customisation

- Replace the placeholder images (`https://placehold.co`) with actual product photos.
- Update prices, product names, and descriptions in `index.html`.
- Adjust colour palette or fonts in `styles.css` as desired.

## Backend API

The `server` directory contains a Node.js + Express backend with:

- SQLite database via Sequelize (file `server/database.sqlite`)
- JWT-based auth (`/api/auth/register`, `/api/auth/login`)
- Product catalog (`/api/products`)
- Stripe checkout + webhook (`/api/orders/checkout`, `/api/orders/webhook`)
- Order storage & status updates

### Environment variables

Create a `.env` file in `server/` with:

```
PORT=4000
JWT_SECRET=supersecretkey
STRIPE_SECRET_KEY=sk_test_yourkey
STRIPE_WEBHOOK_SECRET=whsec_yourkey
CLIENT_URL=http://localhost:5500
```

### Running locally

```
cd server
npm install
npm run dev   # starts nodemon on :4000
```

The DB is auto-seeded with the three sample monkey-shoe products.

### Front-end → Back-end communication

- Cart checkout sends the product IDs & quantities; backend returns a Stripe session URL which the browser redirects to.
- After successful payment, Stripe redirects back to `cart.html?success=true` and a webhook updates the order status to **paid**.

---
Crafted with care by an AI assistant 🚀