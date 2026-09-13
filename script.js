// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    console.log('Navigating to:', link.getAttribute('href'));
    navLinks?.classList.remove('open');
  });
});

// Contact form — posts to the Cloudflare Pages Function at /api/contact
// (see functions/api/contact.js). That function needs a RESEND_API_KEY
// secret configured before it will actually deliver mail.
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(contactForm).entries());

    submitBtn.disabled = true;
    formStatus.classList.remove('form-status-error');
    formStatus.textContent = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.ok) {
        formStatus.textContent = "Thanks! We'll get back to you soon.";
        contactForm.reset();
      } else {
        formStatus.classList.add('form-status-error');
        formStatus.textContent =
          result.error || 'Something went wrong. Please email hello@logiclearn.net directly.';
      }
    } catch {
      formStatus.classList.add('form-status-error');
      formStatus.textContent =
        'Network error. Please email hello@logiclearn.net directly.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

console.log('LogicLearn site loaded successfully!');
