// --- 1. SLOW MATRIX TEXT EFFECT ---
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 150);
      const end = start + Math.floor(Math.random() * 160);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.05) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color: #0044FF; opacity: 0.7;">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Inisialisasi Efek Teks
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector(".scramble-text");
  if (el) {
    const fx = new TextScramble(el);
    const finalPhrase = el.innerHTML;
    el.innerHTML = "";
    setTimeout(() => {
      el.style.opacity = 1;
      fx.setText(finalPhrase.replace(/<br>/g, "\n"));
    }, 800);
  }
});

// --- 2. SCROLL REVEAL & COUNTER ---
const revealElements = document.querySelectorAll(".reveal");
const revealCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      if (entry.target.classList.contains("stats-bar")) {
        runCounter();
      }
      observer.unobserve(entry.target);
    }
  });
};
const revealOptions = { threshold: 0.15 };
const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
revealElements.forEach((el) => revealObserver.observe(el));

// --- 3. NUMBER COUNTER LOGIC ---
function runCounter() {
  const counters = document.querySelectorAll(".stat-value");
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    if (!target) return;
    const speed = 400;
    const increment = target / speed;
    const updateCount = () => {
      const count = +counter.innerText;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target + (target === 50 ? "+" : "");
      }
    };
    updateCount();
  });
}

// --- 4. NAVIGATION SCROLL (CLEAN) ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});
