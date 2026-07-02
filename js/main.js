/* ============================================================
   Faraz Omar — Portfolio interactions
   GSAP + ScrollTrigger + Lenis, custom cursor, counters
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  /* ---------- Clocks (Toronto time) ---------- */
  function updateClocks() {
    const now = new Date().toLocaleTimeString("en-CA", {
      timeZone: "America/Toronto",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const nav = document.getElementById("navClock");
    const foot = document.getElementById("footClock");
    if (nav) nav.textContent = now;
    if (foot) foot.textContent = now + " ET";
  }
  updateClocks();
  setInterval(updateClocks, 30000);

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      mobileMenu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Nav scroll behaviour ---------- */
  const siteNav = document.getElementById("siteNav");
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      siteNav.classList.toggle("is-scrolled", y > 40);
      // hide on scroll down, reveal on scroll up
      if (y > 300 && y > lastScrollY + 4) siteNav.classList.add("is-hidden");
      else if (y < lastScrollY - 4) siteNav.classList.remove("is-hidden");
      lastScrollY = y;
    },
    { passive: true }
  );

  /* ---------- Custom cursor ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll("a, button, [data-hover], [data-hover-card]").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !prefersReducedMotion && hasGsap) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.35;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ---------- Split hero title into chars ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      el.appendChild(span);
    });
  });

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const tick = document.getElementById("preloaderTick");

  function killPreloader(instant) {
    if (!preloader) return;
    if (instant || !hasGsap) {
      preloader.style.display = "none";
      return;
    }
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => (preloader.style.display = "none"),
    });
  }

  function heroIntro() {
    if (!hasGsap || prefersReducedMotion) return;
    const chars = document.querySelectorAll(".hero-title .char");
    gsap.fromTo(
      chars,
      { yPercent: 110, rotate: 4, willChange: "transform" },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1,
        stagger: 0.045,
        ease: "power4.out",
        delay: 0.15,
        onComplete: () => gsap.set(chars, { clearProps: "will-change" }),
      }
    );
    gsap.fromTo(
      ".hero [data-reveal], .scroll-cue",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.55 }
    );
    // draw sparkline
    const line = document.getElementById("sparkLine");
    if (line) {
      const len = line.getTotalLength();
      gsap.fromTo(
        line,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", delay: 0.5 }
      );
      gsap.fromTo("#sparkArea", { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.6 });
      gsap.fromTo("#sparkDot", { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.4, ease: "back.out(3)", delay: 2.2 });
    }
  }

  function runPreloader() {
    if (prefersReducedMotion || !hasGsap || !preloader) {
      killPreloader(true);
      heroIntro();
      return;
    }
    const counter = { v: 0 };
    gsap.to(counter, {
      v: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (tick) tick.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
      onComplete: () => {
        killPreloader(false);
        heroIntro();
      },
    });
  }

  /* ---------- Everything that needs GSAP/ScrollTrigger ---------- */
  function initScroll() {
    if (!hasGsap || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    /* Lenis smooth scroll */
    if (!prefersReducedMotion && typeof Lenis !== "undefined") {
      const lenis = new Lenis({ lerp: 0.16, smoothWheel: true, wheelMultiplier: 1.1 });
      window.__lenis = lenis;
      // kill native smooth-scrolling while Lenis drives the scroll position —
      // otherwise the browser re-eases every frame Lenis writes (rubber-band lag)
      document.documentElement.classList.add("lenis");
      document.documentElement.style.scrollBehavior = "auto";
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      // anchor links through Lenis
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          const target = document.querySelector(a.getAttribute("href"));
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -70, duration: 1.4 });
          }
        });
      });
    }

    /* re-sync trigger positions once a resize/rotation settles */
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
    });

    if (prefersReducedMotion) return;

    /* Generic reveals (outside hero — hero handles its own) */
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.fromTo(
        el,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    /* Staggered groups */
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      gsap.fromTo(
        group.children,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );
    });

    /* Stat counters */
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: end,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString("en-CA");
            },
          }),
      });
    });

    /* Experience timeline progress */
    const progress = document.getElementById("timelineProgress");
    if (progress) {
      gsap.to(progress, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });
    }

    /* Marquee: only animate while on screen */
    const track = document.getElementById("marqueeTrack");
    if (track && "IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        },
        { rootMargin: "100px" }
      ).observe(track.parentElement);
    }

    /* Marquee reacts to scroll velocity (desktop only — extra tweens jank touch scroll) */
    if (track && !isTouch) {
      let proxy = { skew: 0 };
      const clamp = gsap.utils.clamp(-8, 8);
      ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -280);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.7,
              ease: "power3",
              overwrite: true,
              onUpdate: () => (track.style.transform = `skewX(${proxy.skew}deg)`),
            });
          }
        },
      });
    }

    /* Hero parallax drift on scroll out */
    gsap.to(".hero-title", {
      yPercent: 18,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-spark", {
      yPercent: -25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    /* Active nav link per section */
    ["about", "experience", "skills", "education", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      const link = document.querySelector(`[data-nav="${id}"]`);
      if (!section || !link) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => link.classList.toggle("is-active", self.isActive),
      });
    });
  }

  /* ---------- Boot ---------- */
  window.addEventListener("load", () => {
    initScroll();
    runPreloader();
  });
})();
