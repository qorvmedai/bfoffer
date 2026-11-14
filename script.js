/**
 * ==========================================================================
 * The Product Launch Accelerator — Black Friday Landing Page
 * Complete Production-Ready JavaScript Engine
 * ==========================================================================
 * 
 * Handles all page interactivity:
 * 1. Motion Preference Detection (prefers-reduced-motion)
 * 2. Scroll Reveal Animation System (IntersectionObserver)
 * 3. Hero Section Staggered Entrance & Glow Pulse
 * 4. High-Precision Countdown Timer (Nov 27, 2026, 23:59:59 WAT / UTC+1)
 * 5. Animated Metric Counters with Easing & Nigerian Currency Formatting
 * 6. Accessible Single-Open FAQ Accordion
 * 7. Sticky Mobile Call-To-Action (CTA) with Bounds Tracking
 * 8. Optimized Fixed Navbar Scroll State
 * 9. Smooth Scroll Navigation with Sticky Header Offset Handling
 * 10. Desktop Parallax Floating Glow Orbs
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize functional components (essential for layout & utility)
  initNav();
  initCountdown();
  initFAQ();
  initStickyCTA();
  initCounters(prefersReducedMotion);
  initScrollReveal(prefersReducedMotion);
  initSmoothScroll();

  // Initialize decorative & motion effects if permitted
  if (!prefersReducedMotion) {
    initHeroAnimation();
    initParallaxOrbs();
  } else {
    // Graceful fallback for reduced motion: show hero elements immediately
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('visible', 'hero-animated');
    });

    const heroPrice = document.getElementById('hero-price');
    if (heroPrice) {
      heroPrice.classList.add('pulse-glow');
    }
  }
});

/**
 * --------------------------------------------------------------------------
 * 1. NAVIGATION SCROLL BEHAVIOR
 * Adds 'scrolled' class to navbar when viewport scrolls beyond 80px.
 * Uses requestAnimationFrame throttling and passive event listeners.
 * --------------------------------------------------------------------------
 */
function initNav() {
  const nav = document.querySelector('.nav') || document.querySelector('header');
  if (!nav) return;

  let ticking = false;

  const updateNav = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true }
  );

  // Initial check on load
  updateNav();
}

/**
 * --------------------------------------------------------------------------
 * 2. HERO SECTION STAGGERED ENTRANCE ANIMATION
 * Animates direct children of .hero-content on page load.
 * Adds custom glow pulse to #hero-price once entrance finishes.
 * --------------------------------------------------------------------------
 */
function initHeroAnimation() {
  const heroContent = document.querySelector('.hero-content');
  const heroElements = document.querySelectorAll('.hero-content > *');
  if (!heroElements.length) return;

  // Set initial invisible state
  heroElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    el.classList.add('hero-initial');
  });

  // Staggered reveal
  heroElements.forEach((el, index) => {
    const delay = 200 + index * 200; // 200ms base + 200ms stagger per child
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.classList.remove('hero-initial');
      el.classList.add('visible', 'hero-animated');
    }, delay);
  });

  // Target the price element for a prominent neon glow pulse
  const heroPrice = document.getElementById('hero-price') || document.querySelector('.hero-price-box');
  if (heroPrice) {
    const pulseDelay = 200 + heroElements.length * 200 + 400;
    setTimeout(() => {
      heroPrice.classList.add('pulse-glow');
      heroPrice.style.animation = 'glowPulse 2.5s ease-in-out infinite alternate';
    }, pulseDelay);
  }
}

/**
 * --------------------------------------------------------------------------
 * 3. BLACK FRIDAY COUNTDOWN TIMER
 * Target: November 27, 2026, 23:59:59 WAT (West Africa Time, UTC+1)
 * Updates days, hours, minutes, seconds every second.
 * --------------------------------------------------------------------------
 */
function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  // If countdown container or nodes do not exist on the page, exit silently
  if (!daysEl && !hoursEl && !minutesEl && !secondsEl) return;

  // Target timestamp: Nov 27, 2026, 23:59:59 WAT (UTC+1)
  const targetDate = new Date('2026-11-27T23:59:59+01:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * --------------------------------------------------------------------------
 * 4. SCROLL REVEAL ANIMATION SYSTEM
 * Uses IntersectionObserver to trigger animations when elements enter viewport.
 * Elements with .stagger-1 to .stagger-8 utilize CSS transition delays.
 * --------------------------------------------------------------------------
 */
function initScrollReveal(prefersReducedMotion) {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-in, .slide-up'
  );

  if (!revealElements.length) return;

  // If user prefers reduced motion, reveal everything immediately without transform
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, stop observing this element
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * --------------------------------------------------------------------------
 * 5. ANIMATED NUMBER COUNTERS
 * Animates numbers on viewport entry from 0 to target value over 2 seconds.
 * Supports data-counter, data-prefix, and data-suffix attributes.
 * Formats values with Nigerian locale commas (en-NG).
 * --------------------------------------------------------------------------
 */
function initCounters(prefersReducedMotion) {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const rawTarget = el.getAttribute('data-counter');
    const target = parseInt(rawTarget, 10);
    if (isNaN(target)) return;

    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';

    // If reduced motion requested, set final text immediately
    if (prefersReducedMotion) {
      el.textContent = `${prefix}${target.toLocaleString('en-NG')}${suffix}`;
      return;
    }

    const duration = 2000; // 2 seconds
    let startTime = null;

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = `${prefix}${current.toLocaleString('en-NG')}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target.toLocaleString('en-NG')}${suffix}`;
      }
    };

    window.requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counterElements.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));
}

/**
 * --------------------------------------------------------------------------
 * 6. ACCESSIBLE FAQ ACCORDION (SINGLE-OPEN MODE)
 * Smoothly expands/collapses FAQ answers by computing dynamic scrollHeight.
 * Fully keyboard accessible with ARIA attributes and Space/Enter support.
 * --------------------------------------------------------------------------
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  const closeItem = (item) => {
    item.classList.remove('active');
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question) question.setAttribute('aria-expanded', 'false');
    if (answer) {
      answer.style.maxHeight = '0px';
      answer.setAttribute('aria-hidden', 'true');
    }
  };

  const openItem = (item) => {
    item.classList.add('active');
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question) question.setAttribute('aria-expanded', 'true');
    if (answer) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      answer.setAttribute('aria-hidden', 'false');
    }
  };

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    // Accessibility initialization
    if (!question.hasAttribute('aria-expanded')) {
      question.setAttribute('aria-expanded', 'false');
    }
    answer.setAttribute('aria-hidden', 'true');
    answer.style.maxHeight = '0px';

    const toggle = () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other accordion items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          closeItem(otherItem);
        }
      });

      // Toggle current item
      if (isCurrentlyActive) {
        closeItem(item);
      } else {
        openItem(item);
      }
    };

    question.addEventListener('click', toggle);

    // Keyboard support for non-button wrappers if needed
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Recalculate max-height on window resize for any active FAQ items
  window.addEventListener(
    'resize',
    () => {
      const activeItem = document.querySelector('.faq-item.active');
      if (activeItem) {
        const answer = activeItem.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      }
    },
    { passive: true }
  );
}

/**
 * --------------------------------------------------------------------------
 * 7. STICKY MOBILE CTA
 * Shows fixed bottom bar on mobile screens once user scrolls past hero section,
 * and hides it when reaching near the footer (within 200px) to prevent overlap.
 * --------------------------------------------------------------------------
 */
function initStickyCTA() {
  const stickyCTA = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero') || document.querySelector('.hero');
  const footer = document.getElementById('footer') || document.querySelector('footer');

  if (!stickyCTA) return;

  let ticking = false;

  const updateStickyCTA = () => {
    const windowHeight = window.innerHeight;

    // If hero or footer are missing, fall back to simple scroll depth
    if (!hero || !footer) {
      if (window.scrollY > 400) {
        stickyCTA.classList.add('visible');
      } else {
        stickyCTA.classList.remove('visible');
      }
      ticking = false;
      return;
    }

    const heroBottom = hero.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;

    // Past hero, and footer is not yet within 200px of viewport bottom
    if (heroBottom < 0 && footerTop > windowHeight + 200) {
      stickyCTA.classList.add('visible');
    } else {
      stickyCTA.classList.remove('visible');
    }

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyCTA);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateStickyCTA();
}

/**
 * --------------------------------------------------------------------------
 * 8. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
 * Intercepts internal anchor clicks, offsets fixed navbar height,
 * and smoothly animates to target element.
 * --------------------------------------------------------------------------
 */
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  const nav = document.querySelector('.nav') || document.querySelector('header');

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth',
      });
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 9. PARALLAX FLOATING ORBS (DESKTOP ONLY)
 * Creates dynamic glowing ambient motion driven by mouse movement.
 * Automatically disabled on mobile screens and reduced-motion environments.
 * --------------------------------------------------------------------------
 */
function initParallaxOrbs() {
  if (window.innerWidth < 768) return;

  const orbs = document.querySelectorAll('.floating-orb');
  if (!orbs.length) return;

  let mouseX = 0;
  let mouseY = 0;
  let ticking = false;

  window.addEventListener(
    'mousemove',
    (e) => {
      // Normalize mouse coordinates from center (-1 to +1)
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          orbs.forEach((orb, i) => {
            const speed = (i + 1) * 15;
            const xOffset = mouseX * speed;
            const yOffset = mouseY * speed;
            orb.style.transform = `translate(${xOffset.toFixed(2)}px, ${yOffset.toFixed(2)}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}
