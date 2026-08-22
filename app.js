(() => {
  "use strict";

  // Mobile navigation
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  navToggle?.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
    navToggle.textContent = mobileNav.classList.contains("show") ? "×" : "☰";
  });

  mobileNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("show");
      navToggle.textContent = "☰";
    });
  });

  // Scroll progress
  const progress = document.getElementById("scrollProgress");
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = `${value}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal animation
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  // Number counters
  const counters = document.querySelectorAll("[data-target]");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || "";
      const decimals = String(target).includes(".")
        ? String(target).split(".")[1].length
        : 0;

      const duration = 1500;
      const start = performance.now();

      const tick = now => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-card").forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const caption = card.querySelector("figcaption strong");

      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = caption?.textContent || "";
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox?.classList.contains("show")) {
      closeLightbox();
    }
  });

  // Subtle particle background
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas?.getContext("2d");
  let particles = [];
  let animationId = null;

  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(70, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      alpha: Math.random() * 0.45 + 0.1
    }));
  };

  const drawParticles = () => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;
      if (p.y < -10) p.y = window.innerHeight + 10;
      if (p.y > window.innerHeight + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(114, 229, 255, ${p.alpha})`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(drawParticles);
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion) {
    resizeCanvas();
    drawParticles();
    window.addEventListener("resize", resizeCanvas);
  }

  // Gentle parallax for hero visual
  const heroCard = document.querySelector(".hero-visual-card");
  const heroStage = document.querySelector(".hero-stage");

  if (heroCard && heroStage && !reducedMotion) {
    heroStage.addEventListener("mousemove", e => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroCard.style.transform =
        `perspective(1000px) rotateY(${x * 9 - 4}deg) rotateX(${-y * 7 + 2}deg) translateY(-2px)`;
    });

    heroStage.addEventListener("mouseleave", () => {
      heroCard.style.transform =
        "perspective(1000px) rotateY(-6deg) rotateX(2deg)";
    });
  }
})();