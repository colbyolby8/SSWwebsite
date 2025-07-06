// Monkey Shoes – client-side cart + interactivity

const CART_KEY = 'monkey_cart';
const bell = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
bell.volume = 0.5;

document.addEventListener('DOMContentLoaded', () => {
  // ---------------- Helpers ----------------
  const loadCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const updateCartCount = () => {
    const span = document.getElementById('cart-count');
    if (span) {
      span.textContent = loadCart().length;
    }
  };

  // ---------------- Add-to-cart ----------------
  document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const name = card.querySelector('h3')?.innerText?.trim() || 'Item';
      const priceText = card.querySelector('.price')?.innerText || '$0';
      const price = parseFloat(priceText.replace(/[^0-9.]+/g, '')) || 0;
      const image = card.querySelector('img')?.src || '';
      const cart = loadCart();
      cart.push({ name, price, image, qty: 1 });
      saveCart(cart);
      updateCartCount();
      // Play bell
      bell.currentTime = 0;
      bell.play().catch(() => {});
    });
  });

  // ---------------- Cart Page ----------------
  const cartTableBody = document.getElementById('cart-items');
  if (cartTableBody) {
    const renderCart = () => {
      const cart = loadCart();
      cartTableBody.innerHTML = '';
      let total = 0;

      cart.forEach((item, idx) => {
        total += item.price * (item.qty || 1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${item.image}" alt="${item.name}" class="cart-thumb"></td>
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td><button class="remove-btn" data-idx="${idx}">Remove</button></td>
        `;
        cartTableBody.appendChild(tr);
      });

      document.getElementById('cart-total').textContent = '$' + total.toFixed(2);

      // Remove buttons
      cartTableBody.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const cart = loadCart();
          cart.splice(idx, 1);
          saveCart(cart);
          renderCart();
          updateCartCount();
        });
      });
    };

    renderCart();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality coming soon!');
      });
    }
  }

  // ---------------- Contact Form ----------------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      alert('Thanks for reaching out! We will swing back to you soon.');
      form.reset();
    });
  }

  // Init
  updateCartCount();
});