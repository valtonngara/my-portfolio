/* ============================================
   PORTFOLIO — main.js
   ============================================ */

// ── Theme toggle ──────────────────────────────
const themeToggle = document.getElementById('theme-toggle');

// Apply saved theme on load (default: dark — no attribute needed)
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  if (next === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('portfolio-theme', next);
});

// ── Navbar scroll state ───────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Active nav-link highlight ─────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Fade-in on scroll ─────────────────────────
const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay');

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom >= 0;
}

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

window.addEventListener('load', () => {
  fadeElements.forEach(el => {
    if (isInViewport(el)) {
      el.classList.add('visible');
    } else {
      fadeObserver.observe(el);
    }
  });
});

// ── Staggered timeline animation ─────────────
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger for each item
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

timelineItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  timelineObserver.observe(item);
});

// ── Mobile hamburger menu ─────────────────────
const hamburger    = document.getElementById('hamburger');
const navLinksEl   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (
    navLinksEl.classList.contains('open') &&
    !navLinksEl.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ── Code window traffic lights ─────────────────
const dotRed     = document.getElementById('dot-red');
const dotYellow  = document.getElementById('dot-yellow');
const dotGreen   = document.getElementById('dot-green');
const codeWindow = document.querySelector('.code-window');
const codeModal  = document.getElementById('code-modal');

// Red — toggle closed overlay
dotRed.addEventListener('click', () => {
  const willClose = !codeWindow.classList.contains('window-closed');
  codeWindow.classList.toggle('window-closed');
  if (willClose) codeWindow.classList.remove('window-minimized');
});

// Yellow — minimize (collapse to title bar only)
dotYellow.addEventListener('click', () => {
  const willMinimize = !codeWindow.classList.contains('window-minimized');
  codeWindow.classList.toggle('window-minimized');
  if (willMinimize) codeWindow.classList.remove('window-closed');
});

// Green — open full editor modal
dotGreen.addEventListener('click', () => {
  codeModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => codeModal.querySelector('.modal-editor').focus(), 80);
});

function closeCodeModal() {
  codeModal.classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('modal-close-btn').addEventListener('click', closeCodeModal);
codeModal.addEventListener('click', (e) => { if (e.target === codeModal) closeCodeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && codeModal.classList.contains('active')) closeCodeModal();
});

// ── Contact form ──────────────────────────────
const form       = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn  = document.getElementById('form-submit-btn');

// Anti-spam: record page load time — bots submit instantly
const formLoadTime = Date.now();

const SUBMIT_BTN_DEFAULT = `Send Message
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>`;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  // ── Spam / bot checks ──────────────────────────
  // 1. Honeypot: hidden field — real users never see or fill it
  const honeypot = document.querySelector('.form-honeypot');
  if (honeypot && honeypot.value.trim() !== '') {
    // Silent reject — don't hint at why submission failed
    form.reset();
    return;
  }
  // 2. Time check: humans take >3 s to fill a form; bots do it instantly
  if (Date.now() - formLoadTime < 3000) {
    setFormStatus('Please slow down and try again.', 'error');
    return;
  }
  // ─────────────────────────────────────────────

  if (!name || !email || !message) {
    setFormStatus('Please fill in all required fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    setFormStatus('Please enter a valid email address.', 'error');
    return;
  }

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/xojnoznz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, subject, message })
    });

    if (response.ok) {
      setFormStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
      setTimeout(() => setFormStatus('', ''), 6000);
    } else {
      const data = await response.json();
      const errMsg = data?.errors?.map(e => e.message).join(', ')
                     || 'Something went wrong. Please try again.';
      setFormStatus(errMsg, 'error');
    }
  } catch (_) {
    setFormStatus('Network error. Please email me directly at valton.gara@gmail.com', 'error');
  } finally {
    submitBtn.innerHTML = SUBMIT_BTN_DEFAULT;
    submitBtn.disabled = false;
  }
});

function setFormStatus(text, type) {
  formStatus.textContent = text;
  formStatus.className = type ? `form-note ${type}` : 'form-note';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Input focus enhancements ──────────────────
document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
  input.addEventListener('focus', () => input.closest('.form-group')?.classList.add('focused'));
  input.addEventListener('blur',  () => input.closest('.form-group')?.classList.remove('focused'));
});

// ── Subtle card tilt (mouse-follow, desktop only) ──
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.highlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -3;   // max ±3°
      const tiltY  = dx *  3;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
