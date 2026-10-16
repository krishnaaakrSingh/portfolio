// ==========================================
// 0. CONFIG / HELPERS
// ==========================================

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// Locomotive sirf laptop/desktop (mouse wale device + width > 767px) par chalega.
// Phone/tablet (touch) par native scroll rahega.
const IS_DESKTOP = window.matchMedia(
  "(min-width: 768px) and (hover: hover) and (pointer: fine)"
).matches;

const IS_MOBILE_WIDTH = window.innerWidth <= 767;

let locoScroll = null;

// Desktop => ".container" (Locomotive), Mobile => normal window scroll
const SCROLLER = IS_DESKTOP ? ".container" : window;

// Ek frame mein ek hi baar callback chalao (mousemove/touchmove optimize)
function rafThrottle(fn) {
  let ticking = false;
  let lastArgs;

  return function (...args) {
    lastArgs = args;
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;
      fn(...lastArgs);
    });
  };
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// Scroll listener: desktop => Locomotive, mobile => native scroll
function onScrollY(callback) {
  if (locoScroll) {
    locoScroll.on("scroll", (args) => callback(args.scroll.y));
  } else {
    window.addEventListener(
      "scroll",
      () => callback(window.scrollY || window.pageYOffset),
      { passive: true }
    );
  }
}


// ==========================================
// 1. LOCOMOTIVE SCROLL (DESKTOP ONLY)
// ==========================================

function smoothScroll() {
  if (!IS_DESKTOP) return;

  const container = document.querySelector(".container");
  if (!container) return;

  locoScroll = new LocomotiveScroll({
    el: container,
    smooth: true
  });
}


// ==========================================
// 2. SCROLLTRIGGER SETUP
// ==========================================

function scrollTriggerSetup() {
  // Default scroller set: har trigger automatically sahi scroller use karega
  ScrollTrigger.defaults({ scroller: SCROLLER });

  // Mobile: native scroll, proxy ki zaroorat nahi
  if (!IS_DESKTOP) return;

  const container = document.querySelector(".container");
  if (!container || !locoScroll) return;

  // Locomotive → ScrollTrigger
  locoScroll.on("scroll", ScrollTrigger.update);

  // ScrollTrigger → Locomotive
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

  // Refresh
  ScrollTrigger.addEventListener("refresh", () => {
    locoScroll.update();
  });
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
  if (!el) return;

  const preloader = document.querySelector("#preloader");

  const cycle = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        yPercent: -100,
        borderBottomLeftRadius: "50% 18%",
        borderBottomRightRadius: "50% 18%",
        duration: 1,
        ease: "power3.inOut",

        onComplete: () => {
          if (preloader) preloader.style.display = "none";
          refreshScroll();
        }
      });
    }
  });

  const lastIndex = greetings.length - 1;

  greetings.forEach((word, i) => {
    cycle
      .call(() => {
        el.textContent = word;
      })
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.05 });

    if (i === lastIndex) {
      cycle.to(el, { opacity: 1, duration: 0.7 });
    } else {
      cycle.to(el, { opacity: 0, duration: 0.05, delay: 0.06 });
    }
  });
}


// ==========================================
// 4. KRISHNA MARQUEE ANIMATION
// ==========================================

function krishnaAnimation() {
  const marqueeTrack = document.querySelector(".marquee-track");
  if (!marqueeTrack) return;

  const speed = IS_MOBILE_WIDTH ? 1 : 3;

  let trackWidth = marqueeTrack.offsetWidth / 2;
  let posX = 0;
  let direction = -1;
  let lastScrollY = 0;

  // gsap.set har frame ki jagah quickSetter (zyada fast)
  const setX = gsap.quickSetter(marqueeTrack, "x", "px");

  // Resize par width dobara calculate
  window.addEventListener(
    "resize",
    rafThrottle(() => {
      trackWidth = marqueeTrack.offsetWidth / 2;
    })
  );

  // Scroll direction detect (desktop + mobile dono par)
  onScrollY((currentScrollY) => {
    if (currentScrollY > lastScrollY) {
      direction = -1; // DOWN
    } else if (currentScrollY < lastScrollY) {
      direction = 1; // UP
    }

    lastScrollY = currentScrollY;
  });

  // Marquee movement
  gsap.ticker.add(() => {
    posX += speed * direction;

    if (posX <= -trackWidth) posX += trackWidth;
    if (posX > 0) posX -= trackWidth;

    setX(posX);
  });
}


// ==========================================
// 5. PAGE 2 ANIMATION
// ==========================================

function page2Animation() {
  // Helping Brands Heading
  gsap.from(".helping-brands h1 span", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.25,
    ease: "power3.out",

    scrollTrigger: {
      trigger: ".page2",
      scroller: SCROLLER,
      start: "top 60%",
      end: "top 20%",
      scrub: 2
    }
  });

  // Right Paragraph
  gsap.from(".right-p p", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",

    scrollTrigger: {
      trigger: ".right-p",
      scroller: SCROLLER,
      start: "top 65%",
      toggleActions: "play none none reverse"
    }
  });
}


// ==========================================
// 6. MY PROJECTS HEADING
// ==========================================




// ==========================================
// 7. FINAL REFRESH
// ==========================================

function refreshScroll() {
  if (locoScroll) locoScroll.update();
  ScrollTrigger.refresh();
}


// ==========================================
// 8. HAMBURGER
// ==========================================

function hemburger() {
  const btn = document.getElementById("menu-Btn");
  if (!btn) return;

  // Initial state
  gsap.set(btn, { scale: 0, x: 0, y: 0 });

  // SCROLL SHOW / HIDE
  ScrollTrigger.create({
    trigger: ".page1",
    scroller: SCROLLER,
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

  // MAGNET SETTINGS
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

  // BUTTON CENTER
  // NOTE: button apne aap move karta hai (transform), isliye rect se
  // center lete waqt current x/y minus karke "base" center nikalte hain.
  function getCenter() {
    const rect = btn.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function reset() {
    btnX(0);
    btnY(0);
  }

  // MOUSE MAGNET
  function handleMove(clientX, clientY) {
    // Hidden button par magnetic effect nahi
    if (gsap.getProperty(btn, "scale") < 0.5) {
      reset();
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
      const limit = Math.min(1, MAX_PULL / (magnitude || 1));

      btnX(x * limit);
      btnY(y * limit);
    } else {
      reset();
    }
  }

  const throttledMove = rafThrottle(handleMove);

  window.addEventListener(
    "mousemove",
    (e) => throttledMove(e.clientX, e.clientY),
    { passive: true }
  );

  window.addEventListener("mouseleave", reset);

  // TOUCH RESET
  window.addEventListener("touchend", reset, { passive: true });
}


// ==========================================
// 9. ABOUT ME MAGNET
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
      const limit = Math.min(1, MAX_PULL / (mag || 1));

      x *= limit;
      y *= limit;

      gsap.to(button, {
        x,
        y,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true
      });

      gsap.to(label, {
        x: x * LABEL_PULL_RATIO,
        y: y * LABEL_PULL_RATIO,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true
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

  function resetPull() {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      overwrite: true
    });

    gsap.to(label, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      overwrite: true
    });
  }

  const throttledMove = rafThrottle(handleMove);

  document.addEventListener(
    "mousemove",
    (e) => throttledMove(e.clientX, e.clientY),
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) throttledMove(t.clientX, t.clientY);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    () => {
      if (isNear) {
        isNear = false;
        resetPull();
        fillOut();
      }
    },
    { passive: true }
  );

  // =========================================
  // FILL EFFECT
  // =========================================

  function fillIn() {
    gsap.set(fill, { transformOrigin: "bottom" });

    gsap.to(fill, {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.out",
      overwrite: true
    });
  }

  function fillOut() {
    gsap.set(fill, { transformOrigin: "top" });

    gsap.to(fill, {
      scaleY: 0,
      duration: 0.4,
      ease: "power2.in",
      overwrite: true
    });
  }
}


// ==========================================
// 10. IMAGE ANIMATION
// ==========================================

function imageAnimation() {
  // (Paths fix kiye: "./image3" -> "./image3.png", ".project-img.png" -> "./project-img.png")
  const IMAGES = {
    aurora: "./boat.png",
    nimbus: "./crafting.png",
    velvet: "./project-img.png",
    orbit: "./Fix-bug.png",
    field: "./image3.png"
  };

  const LABELS = {
    aurora: "./boat.png",
    nimbus: "./crafting.png",
    velvet: "./project-img.png",
    orbit: "./Fix-bug.png",
    field: "./image3.png"
  };

  // =========================================
  // SVG / IMAGE
  // =========================================

  function svgFor(key) {
    const image = IMAGES[key];
    if (!image) return "";

    return `<img src="${image}" alt="${LABELS[key]}">`;
  }

  // =========================================
  // ELEMENTS
  // =========================================

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

  // =========================================
  // PROJECTS
  // =========================================

  const itemsArr = Array.from(list.querySelectorAll(".proj"));

  // =========================================
  // STATE
  // =========================================

  let showingA = true;
  let active = false;
  let currentIndex = -1;

  // =========================================
  // PREVIEW INITIAL POSITION
  // =========================================

  gsap.set(preview, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    scale: 0,
    opacity: 0,
    transformOrigin: "50% 50%"
  });

  // =========================================
  // FACES
  // =========================================

  gsap.set([faceA, faceB], { yPercent: 100 });
  gsap.set(faceA, { yPercent: 0, zIndex: 2 });
  gsap.set(faceB, { zIndex: 1 });

  // =========================================
  // MAGNETIC BUTTON
  // =========================================

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

  // =========================================
  // OPEN / CLOSE SCALE
  // =========================================

  function openScale() {
    gsap.to(preview, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out"
    });
  }

  function closeScale() {
    gsap.to(preview, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut"
    });
  }

  // =========================================
  // MAGNETIC LOOP
  // Ab sirf tab chalta hai jab preview active ho (idle CPU use zero)
  // =========================================

  const bOff = { x: 0, y: 0 };

  function magneticLoop() {
    const curX = gsap.getProperty(preview, "x");
    const curY = gsap.getProperty(preview, "y");

    const rawOffX = clamp((lastCursor.x - curX) * 1.15, -22, 22);
    const rawOffY = clamp((lastCursor.y - curY) * 1.15, -16, 16);

    bOff.x += (rawOffX - bOff.x) * 0.1;
    bOff.y += (rawOffY - bOff.y) * 0.1;

    const stretch = Math.min(Math.hypot(bOff.x, bOff.y) / 40, 1);

    gsap.set(btnInner, {
      x: bOff.x,
      y: bOff.y,
      scaleX: 1 + stretch * 0.18,
      scaleY: 1 - stretch * 0.1
    });

    gsap.set(viewText, {
      x: bOff.x * 0.4,
      y: bOff.y * 0.4
    });
  }

  function startLoop() {
    gsap.ticker.add(magneticLoop);
  }

  function stopLoop() {
    gsap.ticker.remove(magneticLoop);
    bOff.x = 0;
    bOff.y = 0;
  }

  // =========================================
  // SLIDE IMAGE
  // =========================================

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
      overwrite: true
    });

    gsap.to(outgoing, {
      yPercent: direction > 0 ? -100 : 100,
      duration: 0.55,
      ease: "power3.inOut",
      overwrite: true
    });

    showingA = !showingA;
  }

  // =========================================
  // FIRST IMAGE
  // =========================================

  function showFaceInstant(key) {
    const incoming = showingA ? faceB : faceA;
    const outgoing = showingA ? faceA : faceB;

    incoming.innerHTML = svgFor(key);

    gsap.set(incoming, { zIndex: 2, yPercent: 0 });
    gsap.set(outgoing, { zIndex: 1, yPercent: 100 });

    showingA = !showingA;
  }

  // =========================================
  // PROJECT NAME CENTER
  // =========================================

  function getProjectPosition(item) {
    const target = item.querySelector("h2") || item;
    const rect = target.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  // =========================================
  // OPEN PREVIEW
  // =========================================

  function openPreview(key, x, y, index) {
    const isFirstOpen = !active;

    lastCursor = { x, y };

    if (isFirstOpen) {
      gsap.set(preview, { x, y });
    } else {
      moveTo(x, y);
    }

    // FIRST IMAGE
    if (isFirstOpen || currentIndex === -1) {
      showFaceInstant(key);
    }
    // CHANGE IMAGE
    else if (index !== currentIndex) {
      slideFace(key, index > currentIndex ? 1 : -1);
    }

    currentIndex = index;

    // OPEN
    if (isFirstOpen) {
      openScale();
      btn.classList.add("is-open");
      active = true;
      startLoop();
    }
  }

  // =========================================
  // CLOSE PREVIEW
  // =========================================

  function closePreview() {
    if (!active) return;

    active = false;
    currentIndex = -1;

    stopLoop();
    closeScale();

    btn.classList.remove("is-open");

    gsap.to(btnInner, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.4,
      ease: "power3.out"
    });

    gsap.to(viewText, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out"
    });
  }

  // =========================================
  // DESKTOP HOVER + CURSOR FOLLOW
  // =========================================

  itemsArr.forEach((item, idx) => {
    item.addEventListener("mouseenter", () => {
      const key = item.dataset.key;

      if (!key) {
        console.warn("data-key missing:", item);
        return;
      }

      const position = getProjectPosition(item);
      openPreview(key, position.x, position.y, idx);
    });

    item.addEventListener(
      "mousemove",
      (e) => {
        if (!active) return;
        moveTo(e.clientX, e.clientY);
      },
      { passive: true }
    );
  });

  // =========================================
  // LEAVE PROJECT LIST
  // =========================================

  list.addEventListener("mouseleave", closePreview);

  // =========================================
  // RESIZE
  // =========================================

  window.addEventListener(
    "resize",
    rafThrottle(() => {
      if (!active) {
        gsap.set(preview, {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        });
      }
    })
  );
}


// ==========================================
// INIT
// (Agar tumhare original file mein neeche init/DOMContentLoaded block hai
//  to bas usi order mein calls rakhna. Original file ka end paste mein cut ho gaya tha.)
// ==========================================

// Ek function fail ho to baaki (aur preloader) na ruke
function safe(fn) {
  try {
    fn();
  } catch (err) {
    console.error(fn.name + " failed:", err);
  }
}

let initDone = false;

function init() {
  if (initDone) return; // double init se bachao
  initDone = true;

  safe(smoothScroll);       // desktop only
  safe(scrollTriggerSetup); // desktop => proxy, mobile => native
  safe(greeting);           // preloader
  safe(krishnaAnimation);
  safe(page2Animation);
  safe(hemburger);
  safe(aboutMeMagnet);
  safe(imageAnimation);
  safe(refreshScroll);
}

// "load" images ka wait karta hai (preloader late/ruka lagta hai),
// isliye DOMContentLoaded use kiya
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Images load hone ke baad scroll height sahi karo
window.addEventListener("load", () => safe(refreshScroll));
 
