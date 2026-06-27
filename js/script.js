document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// Active dock item on scroll
const sections = document.querySelectorAll('.section');
const dockItems = document.querySelectorAll('.dock-item');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      dockItems.forEach((item) => {
        item.classList.toggle('active', item.dataset.section === id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach((s) => sectionObserver.observe(s));

// Draggable hero code widget
const heroCode = document.querySelector('.hero-code');
const heroCodeBar = document.querySelector('.hero-code__bar');
let dragOffsetX = 0;
let dragOffsetY = 0;
let currentX = 0;
let currentY = 0;

heroCodeBar.addEventListener('pointerdown', (e) => {
  heroCode.classList.add('dragging');
  heroCodeBar.setPointerCapture(e.pointerId);
  dragOffsetX = e.clientX - currentX;
  dragOffsetY = e.clientY - currentY;
});

heroCodeBar.addEventListener('pointermove', (e) => {
  if (!heroCode.classList.contains('dragging')) return;
  currentX = e.clientX - dragOffsetX;
  currentY = e.clientY - dragOffsetY;
  heroCode.style.transform = `translate(${currentX}px, ${currentY}px)`;
});

heroCodeBar.addEventListener('pointerup', (e) => {
  heroCode.classList.remove('dragging');
  heroCodeBar.releasePointerCapture(e.pointerId);
});

// Hero code typing animation
const heroTyping = document.getElementById('hero-typing');
const heroTypingLines = [
  { prompt: true, text: 'new_instance = Portfolio()' },
  { prompt: true, text: 'print(new_instance.name)' },
  { prompt: false, text: 'Faraz Omar' },
];

function typeHeroLines(lines, container, lineIndex = 0) {
  if (lineIndex >= lines.length) return;
  const { prompt, text } = lines[lineIndex];

  const lineEl = document.createElement('div');
  lineEl.className = 'hero-code__line' + (prompt ? '' : ' output');
  if (prompt) {
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = '>>> ';
    lineEl.appendChild(promptSpan);
  }
  const textSpan = document.createElement('span');
  lineEl.appendChild(textSpan);
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'cursor';
  cursorSpan.textContent = '|';
  lineEl.appendChild(cursorSpan);
  container.appendChild(lineEl);

  let charIndex = 0;
  (function typeChar() {
    if (charIndex < text.length) {
      textSpan.textContent += text[charIndex];
      charIndex++;
      setTimeout(typeChar, 90);
    } else if (lineIndex < lines.length - 1) {
      cursorSpan.remove();
      setTimeout(() => typeHeroLines(lines, container, lineIndex + 1), 800);
    }
  })();
}

if (heroTyping) typeHeroLines(heroTypingLines, heroTyping);

// Contact form -> mailto fallback
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:farazomar4@gmail.com?subject=${subject}&body=${body}`;
});
