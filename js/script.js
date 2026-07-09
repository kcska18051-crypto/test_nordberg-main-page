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

function setupMobileScrollbars() {
  document.querySelectorAll('[data-scrollbar]').forEach((bar) => {
    const name = bar.dataset.scrollbar;
    const track = document.querySelector(`[data-scroll-track="${name}"]`);
    const thumb = bar.querySelector('span');

    if (!track || !thumb) {
      return;
    }

    function updateThumb() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const ratio = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;
      const thumbWidth = Math.max(28, Math.min(100, ratio * 100));
      const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      const offset = progress * (100 - thumbWidth);

      thumb.style.width = `${thumbWidth}%`;
      thumb.style.transform = `translateX(${offset}%)`;
      bar.hidden = maxScroll <= 2;
    }

    updateThumb();
    track.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
  });
}

setupMobileScrollbars();

function formatStatValue(value, format) {
  if (format === 'compact') {
    return Math.round(value).toLocaleString('ru-RU');
  }

  return String(Math.round(value));
}

function animateStatValue(element) {
  const target = Number(element.dataset.countTo);
  const suffix = element.dataset.countSuffix || '';
  const format = element.dataset.countFormat || '';

  if (!Number.isFinite(target) || element.dataset.counted === 'true') {
    return;
  }

  element.dataset.counted = 'true';

  if (reduceMotion) {
    element.textContent = `${formatStatValue(target, format)}${suffix}`;
    return;
  }

  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${formatStatValue(target * eased, format)}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  }

  window.requestAnimationFrame(tick);
}

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

const statValues = document.querySelectorAll('[data-count-to]');
if (statValues.length && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count-to]').forEach(animateStatValue);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.34 });

  document.querySelectorAll('.stats-strip').forEach((section) => statsObserver.observe(section));
} else {
  statValues.forEach(animateStatValue);
}
