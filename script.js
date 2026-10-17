
let locoScroll = null;

const DESKTOP_QUERY = window.matchMedia("(min-width: 1025px)");

function isDesktop() {
  return DESKTOP_QUERY.matches;
}

function getScroller() {
  return isDesktop() ? ".container" : window;
}

let scrollRefreshTimer = null;


// ==========================================
// 1. LOCOMOTIVE SCROLL - DESKTOP ONLY
// ==========================================

function smoothScroll() {
  const container = document.querySelector(".container");

  if (!container) return;

  if (!isDesktop()) {
    if (locoScroll) {
      locoScroll.destroy();
      locoScroll = null;
    }

    return;
  }

  if (!locoScroll && typeof LocomotiveScroll !== "undefined") {
    locoScroll = new LocomotiveScroll({
      el: container,
      smooth: true
    });
  }
}


// ==========================================
// 2. SCROLLTRIGGER SETUP
// ==========================================

function scrollTriggerSetup() {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".container");

  if (!container) return;

  if (isDesktop() && locoScroll) {
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".container", {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },

      pinType: container.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.defaults({
      scroller: ".container"
    });

    ScrollTrigger.addEventListener("refresh", () => {
      if (locoScroll) locoScroll.update();
    });
  } else {
    ScrollTrigger.defaults({
      scroller: window
    });
  }
}


// ==========================================
// 3. PRELOADER / GREETING
// ==========================================

function greeting() {
  const greetings = [
    "• Hello",
    "• Hola",
    "• Bonjour",
    "• स्वागत है",
    "• Ciao",
    "• こんにちは",
    "• Привет",
    "• Hallo",
    "• नमस्ते"
  ];

  const el = document.getElementById("greeting-text");
  const preloader = document.querySelector("#preloader");

  if (!el || !preloader) return;

  const cycle = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        yPercent: -100,
        borderBottomLeftRadius: "50% 18%",
        borderBottomRightRadius: "50% 18%",
        duration: 1,
        ease: "power3.inOut",

        onComplete: () => {
          preloader.style.display = "none";

          if (locoScroll) locoScroll.update();

          ScrollTrigger.refresh();
        }
      });
    }
  });

  greetings.forEach((word, i) => {
    const isLast = i === greetings.length - 1;

    cycle.call(() => {
      el.textContent = word;
    });

    cycle.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.05
      }
    );

    if (isLast) {
      cycle.to(el, {
        opacity: 1,
        duration: 0.7
      });
    } else {
      cycle.to(el, {
        opacity: 0,
        duration: 0.05,
        delay: 0.06
      });
    }
  });
}


// ==========================================
// 4. KRISHNA MARQUEE ANIMATION
// ==========================================

function krishnaAnimation() {
  const marqueeTrack = document.querySelector(".marquee-track");

  if (!marqueeTrack) return;

  const trackWidth = marqueeTrack.offsetWidth / 2;

  let posX = 0;
  let direction = -1;
  let lastScrollY = 0;

  const speed = window.innerWidth <= 767 ? 1 : 3;

  // Scroll direction: Locomotive on desktop, native scroll on mobile
  if (locoScroll) {
    locoScroll.on("scroll", (args) => {
      const currentScrollY = args.scroll.y;

      if (currentScrollY > lastScrollY) {
        direction = -1;
      } else if (currentScrollY < lastScrollY) {
        direction = 1;
      }

      lastScrollY = currentScrollY;
    });
  } else {
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        direction = -1;
      } else if (currentScrollY < lastScrollY) {
        direction = 1;
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // Prevent creating multiple ticker callbacks
  if (marqueeTrack.dataset.tickerAdded === "true") return;
  marqueeTrack.dataset.tickerAdded = "true";

  gsap.ticker.add(() => {
    posX += speed * direction;

    if (trackWidth > 0) {
      if (posX <= -trackWidth) posX += trackWidth;
      if (posX > 0) posX -= trackWidth;
    }

    gsap.set(marqueeTrack, { x: posX });
  });
}


// ==========================================
// 5. PAGE 2 ANIMATION
// ==========================================

function page2Animation() {
  gsap.from(".helping-brands h1 span", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.25,
    ease: "power3.out",

    scrollTrigger: {
      trigger: ".page2",
      scroller: getScroller(),
      start: "top 60%",
      end: "top 20%",
      scrub: 2
    }
  });

  gsap.from(".right-p p", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",

    scrollTrigger: {
      trigger: ".right-p",
      scroller: getScroller(),
      start: "top 65%",
      toggleActions: "play none none reverse"
    }
  });
}


// ==========================================
// 6. FINAL REFRESH
// ==========================================

function refreshScroll() {
  if (locoScroll) locoScroll.update();

  ScrollTrigger.refresh();
}


// ==========================================
// 7. HAMBURGER / DOWNLOAD CV MAGNET
// ==========================================

function hemburger() {
  const btn = document.getElementById("menu-Btn");

  if (!btn) return;

  gsap.set(btn, {
    scale: 0,
    x: 0,
    y: 0
  });

  ScrollTrigger.create({
    id: "hamburgerScrollTrigger",
    trigger: ".page1",
    scroller: getScroller(),
    start: "top -100px",

    onEnter: () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        overwrite: "auto"
      });
    },

    onLeaveBack: () => {
      gsap.to(btn, {
        scale: 0,
        duration: 0.4,
        ease: "power2.in",
        overwrite: "auto"
      });
    }
  });

  const PULL_RADIUS = 100;
  const MAGNET_STRENGTH = 0.5;
  const MAX_PULL = 30;

  const btnX = gsap.quickTo(btn, "x", {
    duration: 0.5,
    ease: "elastic.out(1, 0.3)"
  });

  const btnY = gsap.quickTo(btn, "y", {
    duration: 0.5,
    ease: "elastic.out(1, 0.3)"
  });

  function getCenter() {
    const rect = btn.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function handleMove(clientX, clientY) {
    if (gsap.getProperty(btn, "scale") < 0.5) {
      btnX(0);
      btnY(0);
      return;
    }

    const center = getCenter();

    const dx = clientX - center.x;
    const dy = clientY - center.y;
    const distance = Math.hypot(dx, dy);

    if (distance < PULL_RADIUS) {
      const strength = 1 - distance / PULL_RADIUS;

      let x = dx * MAGNET_STRENGTH * strength;
      let y = dy * MAGNET_STRENGTH * strength;

      const magnitude = Math.hypot(x, y);
      const clamp = Math.min(1, MAX_PULL / (magnitude || 1));

      x *= clamp;
      y *= clamp;

      btnX(x);
      btnY(y);
    } else {
      btnX(0);
      btnY(0);
    }
  }

  window.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
  });

  window.addEventListener("mouseleave", () => {
    btnX(0);
    btnY(0);
  });

  window.addEventListener("touchend", () => {
    btnX(0);
    btnY(0);
  });
}


// ==========================================
// 8. ABOUT ME MAGNET
// ==========================================

function aboutMeMagnet() {
  const button = document.querySelector(".outer-circle");
  const label = document.querySelector(".label");
  const fill = document.querySelector(".fill");

  if (!button || !label || !fill) return;

  const PULL_RADIUS = 130;
  const MAX_PULL = 30;
  const LABEL_PULL_RATIO = 0.5;

  let isNear = false;

  function getCenter() {
    const r = button.getBoundingClientRect();

    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2
    };
  }

  function fillIn() {
    gsap.set(fill, { transformOrigin: "bottom" });

    gsap.to(fill, {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto"
    });
  }

  function fillOut() {
    gsap.set(fill, { transformOrigin: "top" });

    gsap.to(fill, {
      scaleY: 0,
      duration: 0.4,
      ease: "power2.in",
      overwrite: "auto"
    });
  }

  function resetPull() {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto"
    });

    gsap.to(label, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto"
    });
  }

  function handleMove(clientX, clientY) {
    const c = getCenter();

    const dx = clientX - c.x;
    const dy = clientY - c.y;
    const dist = Math.hypot(dx, dy);

    if (dist < PULL_RADIUS) {
      const strength = 1 - dist / PULL_RADIUS;

      let x = dx * strength;
      let y = dy * strength;

      const mag = Math.hypot(x, y);
      const clamp = Math.min(1, MAX_PULL / (mag || 1));

      x *= clamp;
      y *= clamp;

      gsap.to(button, {
        x,
        y,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });

      gsap.to(label, {
        x: x * LABEL_PULL_RATIO,
        y: y * LABEL_PULL_RATIO,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto"
      });

      if (!isNear) {
        isNear = true;
        fillIn();
      }
    } else if (isNear) {
      isNear = false;
      resetPull();
      fillOut();
    }
  }

  document.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
  });

  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];

    if (t) handleMove(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchend", () => {
    if (isNear) {
      isNear = false;
      resetPull();
      fillOut();
    }
  });
}


// ==========================================
// 9. PROJECT IMAGE PREVIEW
// ==========================================

function imageAnimation() {
  const IMAGES = {
    aurora: "./boat.png",
    nimbus: "./crafting.png",
    velvet: "./project-img.png",
    orbit: "./Fix-bug.png",
    field: "./image3.png"
  };

  const LABELS = {
    aurora: "boAt Headphones Sale Hero Banner",
    nimbus: "Crafting Project",
    velvet: "Project Preview",
    orbit: "Bug Fixing Project",
    field: "Field Project"
  };

  function svgFor(key) {
    const image = IMAGES[key];

    if (!image) return "";

    return `<img src="${image}" alt="${LABELS[key] || key}" loading="eager">`;
  }

  const viewText = document.getElementById("viewText");
  const preview = document.getElementById("preview");
  const faceA = document.getElementById("faceA");
  const faceB = document.getElementById("faceB");
  const btn = document.getElementById("cursorBtn");
  const btnInner = document.getElementById("btnInner");
  const list = document.getElementById("list");

  if (!viewText || !preview || !faceA || !faceB || !btn || !btnInner || !list) {
    console.warn("Image animation elements not found.");
    return;
  }

  const itemsArr = Array.from(list.querySelectorAll(".proj"));

  let showingA = true;
  let active = false;
  let currentIndex = -1;

  gsap.set(preview, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    scale: 0,
    opacity: 0,
    transformOrigin: "50% 50%"
  });

  gsap.set([faceA, faceB], { yPercent: 100 });

  gsap.set(faceA, {
    yPercent: 0,
    zIndex: 2
  });

  gsap.set(faceB, { zIndex: 1 });

  const moveX = gsap.quickTo(preview, "x", {
    duration: 0.5,
    ease: "power3.out"
  });

  const moveY = gsap.quickTo(preview, "y", {
    duration: 0.5,
    ease: "power3.out"
  });

  let lastCursor = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  function moveTo(x, y) {
    lastCursor.x = x;
    lastCursor.y = y;

    moveX(x);
    moveY(y);
  }

  function openScale() {
    gsap.to(preview, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto"
    });
  }

  function closeScale() {
    gsap.to(preview, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut",
      overwrite: "auto"
    });
  }

  let bOff = { x: 0, y: 0 };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  // One GSAP ticker instead of a permanent requestAnimationFrame loop
  gsap.ticker.add(() => {
    if (!active) return;

    const curX = gsap.getProperty(preview, "x");
    const curY = gsap.getProperty(preview, "y");

    const rawOffX = clamp((lastCursor.x - curX) * 1.15, -22, 22);
    const rawOffY = clamp((lastCursor.y - curY) * 1.15, -16, 16);

    bOff.x += (rawOffX - bOff.x) * 0.10;
    bOff.y += (rawOffY - bOff.y) * 0.10;

    const stretch = Math.min(Math.hypot(bOff.x, bOff.y) / 40, 1);

    gsap.set(btnInner, {
      x: bOff.x,
      y: bOff.y,
      scaleX: 1 + stretch * 0.18,
      scaleY: 1 - stretch * 0.10
    });

    gsap.set(viewText, {
      x: bOff.x * 0.40,
      y: bOff.y * 0.40
    });
  });

  function slideFace(key, direction) {
    const incoming = showingA ? faceB : faceA;
    const outgoing = showingA ? faceA : faceB;

    incoming.innerHTML = svgFor(key);

    gsap.set(incoming, {
      zIndex: 2,
      yPercent: direction > 0 ? 100 : -100
    });

    gsap.set(outgoing, { zIndex: 1 });

    gsap.to(incoming, {
      yPercent: 0,
      duration: 0.55,
      ease: "power3.inOut",
      overwrite: "auto"
    });

    gsap.to(outgoing, {
      yPercent: direction > 0 ? -100 : 100,
      duration: 0.55,
      ease: "power3.inOut",
      overwrite: "auto"
    });

    showingA = !showingA;
  }

  function showFaceInstant(key) {
    const incoming = showingA ? faceB : faceA;
    const outgoing = showingA ? faceA : faceB;

    incoming.innerHTML = svgFor(key);

    gsap.set(incoming, {
      zIndex: 2,
      yPercent: 0
    });

    gsap.set(outgoing, {
      zIndex: 1,
      yPercent: 100
    });

    showingA = !showingA;
  }

  function getProjectPosition(item) {
    const title = item.querySelector("h2");
    const rect = (title || item).getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function openPreview(key, x, y, index) {
    if (!IMAGES[key]) return;

    const isFirstOpen = !active;

    lastCursor = { x, y };

    if (isFirstOpen) {
      gsap.set(preview, { x, y });
    } else {
      moveTo(x, y);
    }

    if (isFirstOpen || currentIndex === -1) {
      showFaceInstant(key);
    } else if (index !== currentIndex) {
      slideFace(key, index > currentIndex ? 1 : -1);
    }

    currentIndex = index;

    if (isFirstOpen) {
      openScale();
      btn.classList.add("is-open");
      active = true;
    }
  }

  function closePreview() {
    if (!active) return;

    active = false;
    currentIndex = -1;

    closeScale();
    btn.classList.remove("is-open");

    gsap.to(btnInner, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto"
    });

    gsap.to(viewText, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto"
    });

    bOff.x = 0;
    bOff.y = 0;
  }

  // Desktop hover preview
  itemsArr.forEach((item, idx) => {
    item.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: none)").matches) return;

      const key = item.dataset.key;

      if (!key) {
        console.warn("data-key missing:", item);
        return;
      }

      const position = getProjectPosition(item);

      openPreview(key, position.x, position.y, idx);
    });

    item.addEventListener("mousemove", (e) => {
      if (!active) return;

      moveTo(e.clientX, e.clientY);
    });
  });

  list.addEventListener("mouseleave", closePreview);

  window.addEventListener("resize", () => {
    if (!active) {
      gsap.set(preview, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
    }
  });
}


// ==========================================
// 10. NAV MAGNET
// ==========================================

function navMagnet() {
  const items = document.querySelectorAll(".right span");

  items.forEach((item) => {
    // Avoid adding duplicate dots
    if (item.querySelector(".nav-magnet-dot")) return;

    const dot = document.createElement("div");
    dot.className = "nav-magnet-dot";

    gsap.set(item, { position: "relative" });

    gsap.set(dot, {
      width: 5,
      height: 5,
      backgroundColor: "#fff",
      borderRadius: "50%",
      position: "absolute",
      left: "50%",
      bottom: "-10px",
      xPercent: -50,
      scale: 0,
      pointerEvents: "none"
    });

    item.appendChild(dot);

    const RADIUS = 120;
    const STRENGTH = 0.75;

    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();

      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      if (distance < RADIUS) {
        gsap.to(item, {
          x: dx * STRENGTH,
          y: dy * STRENGTH,
          duration: 0.45,
          ease: "elastic.out(1, 0.2)",
          overwrite: "auto"
        });

        gsap.to(dot, {
          scale: 1,
          duration: 0.3,
          ease: "back.out(2)"
        });
      }
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.2)",
        overwrite: "auto"
      });

      gsap.to(dot, {
        scale: 0,
        duration: 0.3,
        ease: "back.in(2)"
      });
    });
  });

  // Copyright magnet and spin
  const copyright = document.querySelector(".left span");

  if (!copyright) return;

  gsap.set(copyright, { display: "inline-block" });

  // Avoid wrapping the copyright symbol more than once
  if (!copyright.querySelector(".copyright-symbol")) {
    copyright.innerHTML = copyright.innerHTML.replace(
      "©",
      '<span class="copyright-symbol">©</span>'
    );
  }

  const symbol = copyright.querySelector(".copyright-symbol");

  if (!symbol) return;

  gsap.set(symbol, {
    display: "inline-block",
    transformOrigin: "center center"
  });

  const RADIUS = 120;
  const STRENGTH = 0.55;

  copyright.addEventListener("mousemove", (e) => {
    const rect = copyright.getBoundingClientRect();

    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);

    if (distance < RADIUS) {
      gsap.to(copyright, {
        x: dx * STRENGTH,
        y: dy * STRENGTH,
        duration: 0.5,
        ease: "elastic.out(1, 0.2)",
        overwrite: "auto"
      });
    }
  });

  copyright.addEventListener("mouseenter", () => {
    gsap.fromTo(
      symbol,
      { rotation: 0 },
      {
        rotation: 360,
        duration: 0.6,
        ease: "back.out(1.7)",
        overwrite: "auto"
      }
    );
  });

  copyright.addEventListener("mouseleave", () => {
    gsap.to(copyright, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.2)",
      overwrite: "auto"
    });
  });
}


// ==========================================
// 11. LOCATED / FREELANCE SCROLL
// ==========================================

function locatedScroll() {
  ScrollTrigger.getById("locatedScrollTrigger")?.kill();

  const elements = document.querySelectorAll(".located, .freelance");

  if (!elements.length) return;

  // Mobile: no vertical scroll animation
  if (!isDesktop()) {
    gsap.set(elements, { clearProps: "transform" });
    return;
  }

  gsap.to(elements, {
    y: -250,
    ease: "none",

    scrollTrigger: {
      id: "locatedScrollTrigger",
      trigger: ".page1",
      scroller: getScroller(),
      start: "top top",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
}


// ==========================================
// 12. INDIA TIME
// ==========================================

function updateIndiaTime() {
  const time = document.querySelector("#time");

  if (!time) return;

  const indiaTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());

  time.textContent = `${indiaTime} IST`;
}

updateIndiaTime();

setInterval(updateIndiaTime, 1000);


// ==========================================
// 13. GET IN TOUCH MAGNET
// ==========================================

function getInTouchMagnet() {
  const button = document.querySelector(".get-circle");

  if (!button) return;

  const PULL_RADIUS = 130;
  const MAX_PULL = 30;

  let isNear = false;

  function getCenter() {
    const r = button.getBoundingClientRect();

    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2
    };
  }

  function resetPull() {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto"
    });
  }

  function handleMove(clientX, clientY) {
    const c = getCenter();

    const dx = clientX - c.x;
    const dy = clientY - c.y;
    const dist = Math.hypot(dx, dy);

    if (dist < PULL_RADIUS) {
      const strength = 1 - dist / PULL_RADIUS;

      let x = dx * strength;
      let y = dy * strength;

      const mag = Math.hypot(x, y);
      const clamp = Math.min(1, MAX_PULL / (mag || 1));

      x *= clamp;
      y *= clamp;

      gsap.to(button, {
        x,
        y,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });

      isNear = true;
    } else if (isNear) {
      isNear = false;
      resetPull();
    }
  }

  document.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
  });

  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];

    if (t) handleMove(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchend", () => {
    if (isNear) {
      isNear = false;
      resetPull();
    }
  });
}


// ==========================================
// 14. PAGE 3 ROUND ANIMATION
// ==========================================

function page3RoundAnimation() {
  const page3 = document.querySelector(".page3");

  if (!page3) return;

  gsap.to(page3, {
    paddingBottom: "0vh",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    ease: "none",

    scrollTrigger: {
      id: "page3RoundTrigger",
      trigger: page3,
      scroller: getScroller(),
      start: "bottom bottom",
      end: "bottom 40%",
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
}


// ==========================================
// 15. PROJECT FADE IN
// ==========================================

function projectFadeIn() {
  const projects = document.querySelectorAll("#list .proj");

  if (!projects.length) return;

  gsap.set(projects, {
    opacity: 0,
    y: 35
  });

  projects.forEach((project) => {
    gsap.to(project, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",

      scrollTrigger: {
        trigger: project,
        scroller: getScroller(),
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  });
}


// ==========================================
// 16. RESIZE / DEVICE SWITCH
// ==========================================

let previousDesktopState = isDesktop();

function handleResponsiveResize() {
  clearTimeout(scrollRefreshTimer);

  scrollRefreshTimer = setTimeout(() => {
    const nowDesktop = isDesktop();

    // Rebuild the scroll system when crossing the breakpoint.
    // This ensures all existing ScrollTriggers use the correct scroller.
    if (nowDesktop !== previousDesktopState) {
      window.location.reload();
      return;
    }

    if (locoScroll) locoScroll.update();

    ScrollTrigger.refresh();
  }, 200);
}

window.addEventListener("resize", handleResponsiveResize);



document.querySelectorAll('.top .right a[href="#l-footer"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const footer = document.querySelector("#l-footer");
    if (!footer) return;

    if (window.matchMedia("(min-width: 1025px)").matches && locoScroll) {
      locoScroll.scrollTo(footer, {
        offset: 0,
        duration: 1.2,
        disableLerp: false
      });

      // Footer par pahunchne ke baad scroll position sync karo
      setTimeout(() => {
        locoScroll.update();
        ScrollTrigger.refresh();
      }, 1400);
    } else {
      footer.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});



// ==========================================
// 17. INITIALIZE EVERYTHING
// ==========================================

function init() {
  gsap.registerPlugin(ScrollTrigger);

  smoothScroll();
  scrollTriggerSetup();

  greeting();
  krishnaAnimation();
  page2Animation();
  hemburger();
  aboutMeMagnet();
  imageAnimation();
  navMagnet();
  locatedScroll();
  getInTouchMagnet();
  page3RoundAnimation();
  projectFadeIn();

  updateIndiaTime();
  refreshScroll();
}

init();
