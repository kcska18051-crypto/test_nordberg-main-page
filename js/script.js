(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var slider = document.querySelector("[data-slider]");
  var slides = slider ? Array.prototype.slice.call(slider.querySelectorAll(".hero-slide")) : [];
  var currentSlide = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.classList.toggle("is-open", open);
  }

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });
  }

  document.addEventListener("click", function (event) {
    if (!mobileMenu || !menuButton) return;
    if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
      setMenu(false);
    }
  });

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });
  }

  var prev = document.querySelector("[data-slide-prev]");
  var next = document.querySelector("[data-slide-next]");
  if (prev) prev.addEventListener("click", function () { showSlide(currentSlide - 1); });
  if (next) next.addEventListener("click", function () { showSlide(currentSlide + 1); });

  if (slides.length > 1 && !reduceMotion) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 6500);
  }

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  }
})();
