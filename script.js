let locoScroll;


// ==========================================
// 1. LOCOMOTIVE SCROLL
// ==========================================

function smoothScroll() {

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

  gsap.registerPlugin(ScrollTrigger);

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


    pinType: container.style.transform
      ? "transform"
      : "fixed"

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


  const cycle = gsap.timeline({

    onComplete: () => {

      gsap.to("#preloader", {

        yPercent: -100,

        borderBottomLeftRadius: "50% 18%",
        borderBottomRightRadius: "50% 18%",

        duration: 1,

        ease: "power3.inOut",

        onComplete: () => {

          const preloader =
            document.querySelector("#preloader");

          if (preloader) {
            preloader.style.display = "none";
          }


          if (locoScroll) {
            locoScroll.update();
          }


          ScrollTrigger.refresh();

        }

      });

    }

  });


  greetings.forEach((word, i) => {

    const isLast =
      i === greetings.length - 1;


    cycle

      .call(() => {

        el.textContent = word;

      })


      .fromTo(

        el,

        {
          opacity: 0
        },

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

    }

    else {

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

  const marqueeTrack =
    document.querySelector(".marquee-track");


  if (!marqueeTrack || !locoScroll) return;


  const trackWidth =
    marqueeTrack.offsetWidth / 2;


  let posX = 0;

  let direction = -1;

  let lastScrollY = 0;

  const speed = window.innerWidth<= 767 ? 1 : 3;


  // Detect scroll direction
  locoScroll.on("scroll", (args) => {

    const currentScrollY =
      args.scroll.y;


    // DOWN
    if (currentScrollY > lastScrollY) {

      direction = -1;

    }


    // UP
    else if (currentScrollY < lastScrollY) {

      direction = 1;

    }


    lastScrollY = currentScrollY;

  });


  // Marquee movement
  gsap.ticker.add(() => {

    posX += speed * direction;


    if (posX <= -trackWidth) {

      posX += trackWidth;

    }


    if (posX > 0) {

      posX -= trackWidth;

    }


    gsap.set(marqueeTrack, {
      x: posX
    });

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

      scroller: ".container",

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

      scroller: ".container",

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

  if (locoScroll) {

    locoScroll.update();

  }

  ScrollTrigger.refresh();

}


// ==========================================
// 8. HAMBURGER
// ==========================================

function hemburger() {
  const btn = document.getElementById("menu-Btn");
  if (!btn) return;

  // Initial state
  gsap.set(btn, {
    scale: 0,
    x: 0,
    y: 0
  });

  // SCROLL SHOW / HIDE
  ScrollTrigger.create({
    trigger: ".page1",
    scroller: ".container",
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
  function getCenter() {
    const rect = btn.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  // MOUSE MAGNET
  function handleMove(clientX, clientY) {
    // Hidden button par magnetic effect nahi
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

  // TOUCH RESET
  window.addEventListener("touchend", () => {
    btnX(0);
    btnY(0);
  });
}



// ==========================================
// 9. ABOUT ME MAGNET
// ==========================================

function aboutMeMagnet() {

  const button =
    document.querySelector(".outer-circle");

  const label =
    document.querySelector(".label");

  const fill =
    document.querySelector(".fill");


  if (!button || !label || !fill) return;


  const PULL_RADIUS = 130;

  const MAX_PULL = 30;

  const LABEL_PULL_RATIO = 0.5;


  let isNear = false;


  function getCenter() {

    const r =
      button.getBoundingClientRect();


    return {

      x: r.left + r.width / 2,

      y: r.top + r.height / 2

    };

  }


  function handleMove(clientX, clientY) {

    const c =
      getCenter();


    const dx =
      clientX - c.x;

    const dy =
      clientY - c.y;


    const dist =
      Math.hypot(dx, dy);


    if (dist < PULL_RADIUS) {

      const strength =
        1 - dist / PULL_RADIUS;


      let x =
        dx * strength;

      let y =
        dy * strength;


      const mag =
        Math.hypot(x, y);


      const clamp =
        Math.min(
          1,
          MAX_PULL / (mag || 1)
        );


      x *= clamp;

      y *= clamp;


      gsap.to(button, {

        x,
        y,

        duration: 0.6,

        ease: "power3.out",

        overwrite: true

      });


      gsap.to(label, {

        x:
          x *
          LABEL_PULL_RATIO,

        y:
          y *
          LABEL_PULL_RATIO,

        duration: 0.4,

        ease: "power3.out",

        overwrite: true

      });


      if (!isNear) {

        isNear = true;

        fillIn();

      }

    }

    else {

      if (isNear) {

        isNear = false;

        resetPull();

        fillOut();

      }

    }

  }


  function resetPull() {

    gsap.to(button, {

      x: 0,

      y: 0,

      duration: 0.8,

      ease: "elastic.out(1, 0.3)"

    });


    gsap.to(label, {

      x: 0,

      y: 0,

      duration: 0.5,

      ease: "power3.out"

    });

  }


  document.addEventListener(
    "mousemove",

    (e) => {

      handleMove(
        e.clientX,
        e.clientY
      );

    }

  );


  document.addEventListener(
    "touchmove",

    (e) => {

      const t =
        e.touches[0];


      if (t) {

        handleMove(
          t.clientX,
          t.clientY
        );

      }

    },

    {
      passive: true
    }

  );


  document.addEventListener(
    "touchend",

    () => {

      if (isNear) {

        isNear = false;

        resetPull();

        fillOut();

      }

    }

  );


  // =========================================
  // FILL EFFECT
  // =========================================

  function fillIn() {

    gsap.set(fill, {

      transformOrigin: "bottom"

    });


    gsap.to(fill, {

      scaleY: 1,

      duration: 0.5,

      ease: "power3.out"

    });

  }


  function fillOut() {

    gsap.set(fill, {

      transformOrigin: "top"

    });


    gsap.to(fill, {

      scaleY: 0,

      duration: 0.4,

      ease: "power2.in"

    });

  }

}


// ==========================================
// 10. IMAGE ANIMATION
// ==========================================

function imageAnimation() {

  const IMAGES = {

    aurora:"./boat.png",


    nimbus:
      "./crafting.png",

    velvet:
      "./project-img.png",

    orbit:
      "./Fix-bug.png",

    field:
      "./image3"

  };


  const LABELS = {

    aurora: "./boat.png",

    nimbus: "./crafting.png",

    velvet: ".project-img.png",

    orbit: "./Fix-bug.png",

    field: "./image3.png"

  };


  // =========================================
  // SVG / IMAGE
  // =========================================

  function svgFor(key) {

    const image =
      IMAGES[key];


    if (!image) return "";


    return `

      <img
        src="${image}"
        alt="${LABELS[key]}"
      >

    `;

  }


  // =========================================
  // ELEMENTS
  // =========================================

  const viewText =
    document.getElementById("viewText");

  const preview =
    document.getElementById("preview");

  const faceA =
    document.getElementById("faceA");

  const faceB =
    document.getElementById("faceB");

  const btn =
    document.getElementById("cursorBtn");

  const btnInner =
    document.getElementById("btnInner");

  const list =
    document.getElementById("list");


  if (
    !viewText ||
    !preview ||
    !faceA ||
    !faceB ||
    !btn ||
    !btnInner ||
    !list
  ) {

    console.warn(
      "Image animation elements not found."
    );

    return;

  }


  // =========================================
  // PROJECTS
  // =========================================

  const items =
    list.querySelectorAll(".proj");

  const itemsArr =
    Array.from(items);


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

    x:
      window.innerWidth / 2,

    y:
      window.innerHeight / 2,

    scale: 0,

    opacity: 0,

    transformOrigin:
      "50% 50%"

  });


  // =========================================
  // FACES
  // =========================================

  gsap.set(
    [faceA, faceB],
    {
      yPercent: 100
    }
  );


  gsap.set(faceA, {

    yPercent: 0,

    zIndex: 2

  });


  gsap.set(faceB, {

    zIndex: 1

  });


  // =========================================
  // MAGNETIC BUTTON
  // =========================================

  const moveX =
    gsap.quickTo(
      preview,
      "x",
      {
        duration: 0.5,
        ease: "power3.out"
      }
    );


  const moveY =
    gsap.quickTo(
      preview,
      "y",
      {
        duration: 0.5,
        ease: "power3.out"
      }
    );


  let lastCursor = {

    x:
      window.innerWidth / 2,

    y:
      window.innerHeight / 2

  };


  function moveTo(x, y) {

    lastCursor.x = x;

    lastCursor.y = y;

    moveX(x);

    moveY(y);

  }


  // =========================================
  // OPEN
  // =========================================

  function openScale() {

    gsap.to(preview, {

      scale: 1,

      opacity: 1,

      duration: 0.6,

      ease: "power3.out"

    });

  }


  // =========================================
  // CLOSE
  // =========================================

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
  // =========================================

  let bOff = {

    x: 0,

    y: 0

  };


  function clamp(v, a, b) {

    return Math.max(
      a,
      Math.min(b, v)
    );

  }


  function magneticLoop() {

    const curX =
      gsap.getProperty(
        preview,
        "x"
      );


    const curY =
      gsap.getProperty(
        preview,
        "y"
      );


    const rawOffX =
      clamp(

        (lastCursor.x - curX) *
        1.15,

        -22,

        22

      );


    const rawOffY =
      clamp(

        (lastCursor.y - curY) *
        1.15,

        -16,

        16

      );


    bOff.x +=
      (rawOffX - bOff.x) *
      0.10;


    bOff.y +=
      (rawOffY - bOff.y) *
      0.10;


    const stretch =
      Math.min(

        Math.hypot(
          bOff.x,
          bOff.y
        ) / 40,

        1

      );


    const sx =
      1 + stretch * 0.18;


    const sy =
      1 - stretch * 0.10;


    gsap.set(btnInner, {

      x: bOff.x,

      y: bOff.y,

      scaleX: sx,

      scaleY: sy

    });


    gsap.set(viewText, {

      x:
        bOff.x * 0.40,

      y:
        bOff.y * 0.40

    });


    requestAnimationFrame(
      magneticLoop
    );

  }


  requestAnimationFrame(
    magneticLoop
  );


  // =========================================
  // SLIDE IMAGE
  // =========================================

  function slideFace(
    key,
    direction
  ) {

    const incoming =
      showingA
        ? faceB
        : faceA;


    const outgoing =
      showingA
        ? faceA
        : faceB;


    incoming.innerHTML =
      svgFor(key);


    gsap.set(incoming, {

      zIndex: 2,

      yPercent:
        direction > 0
          ? 100
          : -100

    });


    gsap.set(outgoing, {

      zIndex: 1

    });


    gsap.to(incoming, {

      yPercent: 0,

      duration: 0.55,

      ease: "power3.inOut"

    });


    gsap.to(outgoing, {

      yPercent:
        direction > 0
          ? -100
          : 100,

      duration: 0.55,

      ease: "power3.inOut"

    });


    showingA = !showingA;

  }


  // =========================================
  // FIRST IMAGE
  // =========================================

  function showFaceInstant(key) {

    const incoming =
      showingA
        ? faceB
        : faceA;


    const outgoing =
      showingA
        ? faceA
        : faceB;


    incoming.innerHTML =
      svgFor(key);


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


  // =========================================
  // PROJECT NAME CENTER
  // =========================================

  function getProjectPosition(item) {

    const title =
      item.querySelector("h2");


    if (!title) {

      const rect =
        item.getBoundingClientRect();


      return {

        x:
          rect.left +
          rect.width / 2,

        y:
          rect.top +
          rect.height / 2

      };

    }


    const rect =
      title.getBoundingClientRect();


    return {

      x:
        rect.left +
        rect.width / 2,

      y:
        rect.top +
        rect.height / 2

    };

  }


  // =========================================
  // OPEN PREVIEW
  // =========================================

  function openPreview(
    key,
    x,
    y,
    index
  ) {

    const isFirstOpen =
      !active;


    lastCursor = {
      x: x,
      y: y
    };


    if (isFirstOpen) {

      gsap.set(preview, {

        x: x,

        y: y

      });

    }

    else {

      moveTo(x, y);

    }


    // FIRST IMAGE
    if (
      isFirstOpen ||
      currentIndex === -1
    ) {

      showFaceInstant(key);

    }


    // CHANGE IMAGE
    else if (
      index !== currentIndex
    ) {

      slideFace(

        key,

        index > currentIndex
          ? 1
          : -1

      );

    }


    currentIndex = index;


    // OPEN
    if (isFirstOpen) {

      openScale();

      btn.classList.add(
        "is-open"
      );

      active = true;

    }

  }


  // =========================================
  // CLOSE PREVIEW
  // =========================================

  function closePreview() {

    if (!active) return;


    active = false;

    currentIndex = -1;


    closeScale();


    btn.classList.remove(
      "is-open"
    );


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

  itemsArr.forEach(
    function (item, idx) {

      item.addEventListener(
        "mouseenter",
        function () {

          const key =
            item.dataset.key;


          if (!key) {

            console.warn(
              "data-key missing:",
              item
            );

            return;

          }


          const position =
            getProjectPosition(item);


          openPreview(

            key,

            position.x,

            position.y,

            idx

          );

        }
      );


      item.addEventListener(
        "mousemove",
        function (e) {

          if (!active) return;


          moveTo(

            e.clientX,

            e.clientY

          );

        }
      );

    }
  );


  // =========================================
  // LEAVE PROJECT LIST
  // =========================================

  list.addEventListener(
    "mouseleave",
    function () {

      closePreview();

    }
  );


  // =========================================
  // RESIZE
  // =========================================

  window.addEventListener(
    "resize",
    function () {

      if (!active) {

        gsap.set(preview, {

          x:
            window.innerWidth / 2,

          y:
            window.innerHeight / 2

        });

      }

    }
  );

}


// ==========================================
// 11. NAV MAGNET
// ==========================================

function navMagnet() {

  // =========================================
  // RIGHT MENU
  // =========================================

  const items =
    document.querySelectorAll(".right span");


  items.forEach((item) => {

    const dot =
      document.createElement("div");


    gsap.set(item, {

      position: "relative"

    });


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


    item.addEventListener(
      "mousemove",
      (e) => {

        const rect =
          item.getBoundingClientRect();


        const dx =
          e.clientX -
          (
            rect.left +
            rect.width / 2
          );


        const dy =
          e.clientY -
          (
            rect.top +
            rect.height / 2
          );


        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          );


        if (
          distance <
          RADIUS
        ) {

          gsap.to(item, {

            x:
              dx *
              STRENGTH,

            y:
              dy *
              STRENGTH,

            duration: 0.45,

            ease:
              "elastic.out(1, 0.2)",

            overwrite: true

          });


          gsap.to(dot, {

            scale: 1,

            duration: 0.3,

            ease:
              "back.out(2)"

          });

        }

      }
    );


    item.addEventListener(
      "mouseleave",
      () => {

        gsap.to(item, {

          x: 0,

          y: 0,

          duration: 1,

          ease:
            "elastic.out(1, 0.2)"

        });


        gsap.to(dot, {

          scale: 0,

          duration: 0.3,

          ease:
            "back.in(2)"

        });

      }
    );

  });


  // =========================================
  // © CODE BY KRISHNA
  // =========================================

  const copyright =
    document.querySelector(".left span");


  if (!copyright) return;


  gsap.set(copyright, {

    display: "inline-block"

  });


  // © ko separate span mein wrap karo
  copyright.innerHTML =
    copyright.innerHTML.replace(

      "©",

      '<span class="copyright-symbol">©</span>'

    );


  const symbol =
    copyright.querySelector(
      ".copyright-symbol"
    );


  gsap.set(symbol, {

    display: "inline-block",

    transformOrigin:
      "center center"

  });


  // Magnetic settings
  const RADIUS = 120;

  const STRENGTH = 0.55;


  // Magnetic movement
  copyright.addEventListener(
    "mousemove",
    (e) => {

      const rect =
        copyright.getBoundingClientRect();


      const dx =
        e.clientX -
        (
          rect.left +
          rect.width / 2
        );


      const dy =
        e.clientY -
        (
          rect.top +
          rect.height / 2
        );


      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (
        distance <
        RADIUS
      ) {

        gsap.to(copyright, {

          x:
            dx *
            STRENGTH,

          y:
            dy *
            STRENGTH,

          duration: 0.5,

          ease:
            "elastic.out(1, 0.2)",

          overwrite: true

        });

      }

    }
  );


  // Har hover par © spin
  copyright.addEventListener(
    "mouseenter",
    () => {

      gsap.fromTo(

        symbol,

        {
          rotation: 0
        },

        {
          rotation: 360,

          duration: 0.6,

          ease:
            "back.out(1.7)"

        }

      );

    }
  );




  

  // Magnetic reset
  copyright.addEventListener(
    "mouseleave",
    () => {

      gsap.to(copyright, {

        x: 0,

        y: 0,

        duration: 1,

        ease:
          "elastic.out(1, 0.2)"

      });

    }
  );

}





// ==========================================
// 12. LOCATED / FREELANCE SCROLL
// ==========================================

function locatedScroll() {
// Purani animation aur ScrollTrigger ko remove karo
ScrollTrigger.getById("locatedScrollTrigger")?.kill();

// Mobile par animation nahi chalegi
if (window.matchMedia("(max-width: 767px)").matches) {
gsap.set(".located, .freelance", {
clearProps: "transform"
});
return;
}

// Sirf desktop / system par animation
gsap.to(".located, .freelance", {
y: -250,
ease: "none",


scrollTrigger: {
  id: "locatedScrollTrigger",
  trigger: ".page1",
  scroller: ".container",
  start: "top top",
  end: "bottom top",
  scrub: 1,
  invalidateOnRefresh: true
}


});
}

// Screen resize hone par animation update karo
let locatedResizeTimer;

window.addEventListener("resize", () => {
clearTimeout(locatedResizeTimer);

locatedResizeTimer = setTimeout(() => {
ScrollTrigger.getById("locatedScrollTrigger")?.kill();


gsap.set(".located, .freelance", {
  clearProps: "transform"
});

locatedScroll();
ScrollTrigger.refresh();

if (locoScroll) {
  locoScroll.update();
}


}, 200);
});


function updateIndiaTime() {
  const time = document.querySelector("#time");

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

  function handleMove(clientX, clientY) {

    const c = getCenter();

    const dx = clientX - c.x;
    const dy = clientY - c.y;

    const dist = Math.hypot(dx, dy);

    if (dist < PULL_RADIUS) {

      const strength =
        1 - dist / PULL_RADIUS;

      let x = dx * strength;
      let y = dy * strength;

      const mag = Math.hypot(x, y);

      const clamp =
        Math.min(
          1,
          MAX_PULL / (mag || 1)
        );

      x *= clamp;
      y *= clamp;

      gsap.to(button, {

        x,
        y,

        duration: 0.6,

        ease: "power3.out",

        overwrite: true

      });

      isNear = true;

    } else {

      if (isNear) {

        isNear = false;

        resetPull();

      }

    }

  }

  function resetPull() {

    gsap.to(button, {

      x: 0,
      y: 0,

      duration: 0.8,

      ease: "elastic.out(1, 0.3)"

    });

  }

  document.addEventListener("mousemove", (e) => {

    handleMove(
      e.clientX,
      e.clientY
    );

  });

  document.addEventListener(
    "touchmove",

    (e) => {

      const t = e.touches[0];

      if (t) {

        handleMove(
          t.clientX,
          t.clientY
        );

      }

    },

    {
      passive: true
    }

  );

  document.addEventListener(
    "touchend",

    () => {

      if (isNear) {

        isNear = false;

        resetPull();

      }

    }

  );

}



function page3RoundAnimation() {

  gsap.to(".page3", {
    paddingBottom: "0vh",

    scrollTrigger: {
      trigger: ".page3",
      scroller: ".container",

      start: "top 80%",
      end: "top 20%",

      scrub: 1
    }
  });

  gsap.to(".page3::after", {
    y: "100%",
    scrollTrigger: {
      trigger: ".page3",
      scroller: ".container",

      start: "top 80%",
      end: "top 20%",

      scrub: 1
    }
  });

}




/* PAGE 3 - OVAL TO STRAIGHT ON SCROLL */



function page3RoundAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  const page3 = document.querySelector(".page3");
  if (!page3) return;

  gsap.to(page3, {
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    ease: "none",

    scrollTrigger: {
      trigger: page3,
      scroller: ".container",
      start: "bottom bottom",
      end: "bottom 40%",
      scrub: true,
      invalidateOnRefresh: true
    }
  });
}

function projectFadeIn() {
const projects = document.querySelectorAll("#list .proj");

if (!projects.length) return;

// Purani animations clear karo
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
    scroller: ".container",
    start: "top 90%",
    toggleActions: "play none none none"
  }
});


});
}


// ==========================================
// 13. INITIALIZE EVERYTHING
// ==========================================

function init() {
  smoothScroll();

  scrollTriggerSetup();

  page3RoundAnimation()

  updateIndiaTime()

  getInTouchMagnet()

  greeting();

  krishnaAnimation();

  page2Animation();

  refreshScroll();

  hemburger();

  aboutMeMagnet();

  imageAnimation();

  navMagnet();

  locatedScroll();

  projectFadeIn()

}


init();