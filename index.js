/* ============================================================
   LARYA FASHION
   Main JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     MOBILE MENU
     ============================================================ */

  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".header__toggle");

  if (header && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );
    });

    // Close mobile menu when clicking a menu link
    const mobileLinks = document.querySelectorAll(
      ".mobile-menu__link"
    );

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ============================================================
     HERO CAROUSEL
     ============================================================ */

  const hero = document.querySelector(".hero");
  const slider = document.querySelector(".hero__slider");
  const slides = document.querySelectorAll(".hero__slide");

  const previousButton = document.querySelector(
    ".hero__nav-btn--prev"
  );

  const nextButton = document.querySelector(
    ".hero__nav-btn--next"
  );

  const dots = document.querySelectorAll(".hero__dot");

  let currentSlide = 0;

  let autoSlideTimer = null;

  const totalSlides = slides.length;


  /* ------------------------------------------------------------
     Update carousel
     ------------------------------------------------------------ */

  function updateSlider() {

    if (!slider || totalSlides === 0) {
      return;
    }

    /*
      Your CSS uses:

      .hero__slider {
        width: 400%;
      }

      .hero__slide {
        width: 25%;
      }

      Therefore moving the slider by 25% moves exactly
      one slide.
    */

    const translateAmount = currentSlide * 25;

    slider.style.transform =
      `translateX(-${translateAmount}%)`;


    /* ----------------------------------------------------------
       Update dots
       ---------------------------------------------------------- */

    dots.forEach((dot, index) => {

      const isActive = index === currentSlide;

      dot.classList.toggle(
        "hero__dot--active",
        isActive
      );

      dot.setAttribute(
        "aria-selected",
        String(isActive)
      );
    });


    /* ----------------------------------------------------------
       Update slide accessibility
       ---------------------------------------------------------- */

    slides.forEach((slide, index) => {

      const isActive = index === currentSlide;

      slide.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

      if (isActive) {
        slide.removeAttribute("inert");
      } else {
        slide.setAttribute("inert", "");
      }
    });
  }


  /* ============================================================
     NEXT SLIDE
     ============================================================ */

  function nextSlide() {

    if (totalSlides === 0) {
      return;
    }

    currentSlide++;

    if (currentSlide >= totalSlides) {
      currentSlide = 0;
    }

    updateSlider();
  }


  /* ============================================================
     PREVIOUS SLIDE
     ============================================================ */

  function previousSlide() {

    if (totalSlides === 0) {
      return;
    }

    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = totalSlides - 1;
    }

    updateSlider();
  }


  /* ============================================================
     BUTTON EVENTS
     ============================================================ */

  if (nextButton) {

    nextButton.addEventListener(
      "click",
      () => {

        nextSlide();

        restartAutoSlide();

      }
    );
  }


  if (previousButton) {

    previousButton.addEventListener(
      "click",
      () => {

        previousSlide();

        restartAutoSlide();

      }
    );
  }


  /* ============================================================
     DOT EVENTS
     ============================================================ */

  dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      currentSlide = index;

      updateSlider();

      restartAutoSlide();

    });

  });


  /* ============================================================
     AUTO SLIDE
     ============================================================ */

  function startAutoSlide() {

    if (totalSlides <= 1) {
      return;
    }

    autoSlideTimer = setInterval(() => {

      nextSlide();

    }, 5000);
  }


  function stopAutoSlide() {

    if (autoSlideTimer !== null) {

      clearInterval(autoSlideTimer);

      autoSlideTimer = null;
    }
  }


  function restartAutoSlide() {

    stopAutoSlide();

    startAutoSlide();
  }


  /* ------------------------------------------------------------
     Pause carousel when user hovers over it
     ------------------------------------------------------------ */

  if (hero) {

    hero.addEventListener(
      "mouseenter",
      stopAutoSlide
    );

    hero.addEventListener(
      "mouseleave",
      startAutoSlide
    );

    hero.addEventListener(
      "focusin",
      stopAutoSlide
    );

    hero.addEventListener(
      "focusout",
      startAutoSlide
    );
  }


  /* ============================================================
     KEYBOARD NAVIGATION
     ============================================================ */

  document.addEventListener("keydown", (event) => {

    /*
      Don't control the carousel while the user is typing
      inside an input.
    */

    const activeElement = document.activeElement;

    const isTyping =
      activeElement &&
      (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT"
      );

    if (isTyping) {
      return;
    }


    if (event.key === "ArrowRight") {

      nextSlide();

      restartAutoSlide();

    }


    if (event.key === "ArrowLeft") {

      previousSlide();

      restartAutoSlide();

    }

  });


  /* ============================================================
     TOUCH / SWIPE SUPPORT
     ============================================================ */

  let touchStartX = 0;
  let touchEndX = 0;


  if (hero) {

    hero.addEventListener(
      "touchstart",
      (event) => {

        touchStartX =
          event.changedTouches[0].screenX;

      },
      { passive: true }
    );


    hero.addEventListener(
      "touchend",
      (event) => {

        touchEndX =
          event.changedTouches[0].screenX;

        handleSwipe();

      },
      { passive: true }
    );
  }


  function handleSwipe() {

    const swipeDistance =
      touchEndX - touchStartX;

    /*
      Ignore tiny finger movements.
    */

    if (Math.abs(swipeDistance) < 50) {
      return;
    }


    if (swipeDistance < 0) {

      // Swipe left
      nextSlide();

    } else {

      // Swipe right
      previousSlide();

    }


    restartAutoSlide();
  }


  /* ============================================================
     INITIALIZE CAROUSEL
     ============================================================ */

  updateSlider();

  startAutoSlide();


  /* ============================================================
     SEARCH
     ============================================================ */

  const searchInput = document.querySelector(
    ".search-bar__input"
  );

  const productCards = document.querySelectorAll(
    ".products__grid .product-card"
  );


  if (searchInput && productCards.length > 0) {

    searchInput.addEventListener(
      "input",
      () => {

        const searchTerm =
          searchInput.value
            .trim()
            .toLowerCase();


        productCards.forEach((card) => {

          const productNameElement =
            card.querySelector(
              ".product-card__name"
            );

          const productName =
            productNameElement
              ? productNameElement.textContent.toLowerCase()
              : "";


          const productMatches =
            productName.includes(searchTerm);


          if (productMatches) {

            card.style.display = "";

          } else {

            card.style.display = "none";

          }

        });

      }
    );
  }


  /* ============================================================
     WISHLIST BUTTONS
     ============================================================ */

  const wishlistButtons =
    document.querySelectorAll(
      ".product-card__wishlist-btn"
    );


  wishlistButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const isPressed =
        button.getAttribute("aria-pressed") === "true";


      button.setAttribute(
        "aria-pressed",
        String(!isPressed)
      );


      if (!isPressed) {

        button.textContent = "💜";

        button.setAttribute(
          "aria-label",
          "Remove from wishlist"
        );

        button.classList.add(
          "wishlist-active"
        );

      } else {

        button.textContent = "♡";

        button.setAttribute(
          "aria-label",
          "Add to wishlist"
        );

        button.classList.remove(
          "wishlist-active"
        );
      }

    });

  });


  /* ============================================================
     HOTSPOTS
     ============================================================ */

  const hotspots =
    document.querySelectorAll(".hotspot");


  hotspots.forEach((hotspot) => {

    /*
      Make hotspots keyboard accessible.
    */

    hotspot.setAttribute(
      "tabindex",
      "0"
    );


    hotspot.setAttribute(
      "role",
      "button"
    );


    /* ----------------------------------------------------------
       Keyboard interaction
       ---------------------------------------------------------- */

    hotspot.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          hotspot.classList.toggle(
            "hotspot-active"
          );
        }

      }
    );


    /* ----------------------------------------------------------
       Click interaction
       ---------------------------------------------------------- */

    hotspot.addEventListener(
      "click",
      () => {

        hotspot.classList.toggle(
          "hotspot-active"
        );

      }
    );

  });


  /* ============================================================
     CLOSE HOTSPOTS WHEN CLICKING ELSEWHERE
     ============================================================ */

  document.addEventListener(
    "click",
    (event) => {

      hotspots.forEach((hotspot) => {

        if (!hotspot.contains(event.target)) {

          hotspot.classList.remove(
            "hotspot-active"
          );

        }

      });

    }
  );


  /* ============================================================
     REDUCE MOTION CHECK
     ============================================================ */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  if (prefersReducedMotion.matches) {

    stopAutoSlide();

  }


  prefersReducedMotion.addEventListener(
    "change",
    (event) => {

      if (event.matches) {

        stopAutoSlide();

      } else {

        startAutoSlide();

      }

    }
  );


  /* ============================================================
     DEBUG MESSAGE
     ============================================================ */

  console.log(
    "Larya Fashion JavaScript initialized successfully."
  );

});