// Monkey Shoes – minimal client-side interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Simulate cart addition
  document.querySelectorAll('.btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Added to cart! (Demo functionality)');
    });
  });

  // Simple contact-form handler
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      alert('Thanks for reaching out! We will swing back to you soon.');
      form.reset();
    });
  }
});