// ===== CUSTOM CURSOR =====
const cursor = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursorTrail");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  setTimeout(() => {
    cursorTrail.style.left = e.clientX + "px";
    cursorTrail.style.top = e.clientY + "px";
  }, 80);
});

// ===== STAR CANVAS =====
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count = 200) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      gold: Math.random() < 0.08
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed;
    const a = Math.abs(Math.sin(s.alpha));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.gold
      ? `rgba(255,215,0,${a * 0.6})`
      : `rgba(200,220,255,${a * 0.8})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeCanvas();
createStars();
drawStars();
window.addEventListener("resize", () => { resizeCanvas(); createStars(); });

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const mobileClose = document.getElementById("mobileClose");

hamburger.addEventListener("click", () => mobileNav.classList.add("open"));
mobileClose.addEventListener("click", () => mobileNav.classList.remove("open"));
function closeMobileNav() { mobileNav.classList.remove("open"); }

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(".reveal, .reveal-up");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately
document.querySelectorAll(".hero .reveal").forEach(el => {
  setTimeout(() => el.classList.add("visible"), 200);
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || "+");
  }, 16);
}

const statNums = document.querySelectorAll(".stat-num");
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ===== REGISTER FORM =====
async function handleRegister(event) {
  event.preventDefault();
  const notification = document.getElementById('notification');
  const messageSpan = document.getElementById('notif-message');

  const formData = new FormData(event.target);


  const response = await fetch('/', { method: 'POST', body: formData });
  const result = await response.json();

  if (result.status === "success") {
    // MANUALLY REDIRECT HERE
    window.location.href = result.redirect_url;
  } else {
    // Show your error notification
    const messageSpan = document.getElementById('notif-message');
    messageSpan.innerText = result.message;
    document.getElementById('notification').style.display = 'flex';
  }
}

// Auto-hide after 5 seconds
setTimeout(closeNotif, 2000);


function closeNotif() {
  document.getElementById('notification').style.display = 'none';
}


// ===== SMOOTH PARALLAX ON HERO RINGS =====
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const rings = document.querySelectorAll(".hero-bg-ring");
  rings.forEach((ring, i) => {
    ring.style.transform = `translateY(${scrollY * (0.1 + i * 0.05)}px)`;
  });
  const heroLight = document.querySelector(".hero-light");
  if (heroLight) heroLight.style.transform = `translateX(-50%) translateY(${scrollY * 0.15}px)`;
});
