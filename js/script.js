const body = document.body;
const header = document.querySelector('[data-header]');
const mobileMenu = document.querySelector('[data-menu]');
const openMenuButton = document.querySelector('[data-menu-open]');
const closeMenuButtons = document.querySelectorAll('[data-menu-close]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeaderState() {
  const isSticky = window.scrollY >= 100;
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
  header?.classList.toggle('is-sticky', isSticky);
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

function openMenu() {
  mobileMenu.classList.add('is-open');
  body.classList.add('menu-open');
}

function closeMenu() {
  mobileMenu.classList.remove('is-open');
  body.classList.remove('menu-open');
}

openMenuButton?.addEventListener('click', openMenu);
closeMenuButtons.forEach((button) => button.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

document.querySelectorAll('.mobile-nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

const slider = document.querySelector('[data-slider]');
if (slider) {
  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const prev = slider.querySelector('[data-slide-prev]');
  const next = slider.querySelector('[data-slide-next]');
  let activeIndex = 0;
  let timerId = null;

  function setSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
  }

  function scheduleAutoPlay() {
    return;
    window.clearInterval(timerId);
    timerId = window.setInterval(() => setSlide(activeIndex + 1), 6500);
  }

  prev?.addEventListener('click', () => {
    setSlide(activeIndex - 1);
    scheduleAutoPlay();
  });

  next?.addEventListener('click', () => {
    setSlide(activeIndex + 1);
    scheduleAutoPlay();
  });

  slider.addEventListener('mouseenter', () => window.clearInterval(timerId));
  slider.addEventListener('mouseleave', scheduleAutoPlay);
  scheduleAutoPlay();
}

const categoryButtons = document.querySelectorAll('.category-tabs button');
categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
  });
});

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-reveal').forEach((section) => observer.observe(section));
} else {
  document.querySelectorAll('.section-reveal').forEach((section) => section.classList.add('is-visible'));
}
