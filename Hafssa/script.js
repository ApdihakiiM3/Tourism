// Loading animation
window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('.loading').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }, 2000); // 2 seconds loading
});

// Background music
const bgMusic = document.getElementById('bgMusic');
const muteButton = document.getElementById('muteButton');

bgMusic.volume = 0.3; // Set volume to 30%

// Autoplay music (may be blocked by browser, but try)
bgMusic.play().catch(function() {
    // Autoplay failed, user interaction required
});

muteButton.addEventListener('click', function() {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        muteButton.textContent = '🔊';
    } else {
        bgMusic.muted = true;
        muteButton.textContent = '🔇';
    }
});

// Heart button click animation
const heartButton = document.getElementById('heartButton');
heartButton.addEventListener('click', function() {
    this.classList.add('active');
    setTimeout(() => this.classList.remove('active'), 250);
    // reveal overlay and create sparkles
    document.getElementById('overlay').classList.add('show');
    createSparklesAround(heartButton, 16);
    setTimeout(() => document.getElementById('overlay').classList.remove('show'), 1800);
});

// Function to create sparkles on button click
function createSparklesAround(el, count = 8) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = i % 2 ? '✨' : '💖';
        document.body.appendChild(sparkle);
        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 80;
        sparkle.style.left = centerX + Math.cos(angle) * 10 + 'px';
        sparkle.style.top = centerY + Math.sin(angle) * 10 + 'px';
        sparkle.style.opacity = '0';
        sparkle.style.transform = 'scale(0.1)';
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 20;
        requestAnimationFrame(() => {
            sparkle.style.transition = 'transform 900ms cubic-bezier(.2,.9,.3,1), opacity 900ms ease, left 900ms ease, top 900ms ease';
            sparkle.style.left = (centerX + dx) + 'px';
            sparkle.style.top = (centerY + dy) + 'px';
            sparkle.style.opacity = '1';
            sparkle.style.transform = 'scale(1)';
        });
        setTimeout(() => {
            sparkle.style.opacity = '0';
            sparkle.style.transform = 'scale(1.6)';
        }, 700);
        setTimeout(() => document.body.removeChild(sparkle), 1200);
    }
}

// Add sparkle animation to CSS via JS (since we can't modify CSS file now)
const style = document.createElement('style');
style.textContent = `
@keyframes sparkle {
    0% { opacity: 1; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(2); }
}
`;
document.head.appendChild(style);

// Smooth scroll for any internal links (though none here, but for future)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for scroll animations (fade in on scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.card, .images, footer').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Gentle heartbeat animation on heart button
// replace JS heartbeat with CSS class for smoother effect
heartButton.style.transition = 'transform 250ms ease';
heartButton.classList.add('pulse');

// create occasional floating hearts dynamically for extra effect
function spawnFloatingHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = ['💖','💕','💗','💓'][Math.floor(Math.random()*4)];
    h.style.left = (10 + Math.random()*80) + '%';
    h.style.fontSize = (14 + Math.random()*18) + 'px';
    h.style.setProperty('--dur', (6 + Math.random()*6) + 's');
    document.querySelector('.floating-hearts').appendChild(h);
    setTimeout(() => { h.remove(); }, 10000);
}

setInterval(spawnFloatingHeart, 1200);

// Image tilt effect based on mouse position
document.querySelectorAll('.image').forEach(img => {
    img.style.transformStyle = 'preserve-3d';
    img.addEventListener('mousemove', e => {
        const rect = img.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-y * 10).toFixed(2);
        const ry = (x * 12).toFixed(2);
        img.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    img.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
});

// Ripple on heart button click
heartButton.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const r = Math.max(rect.width, rect.height);
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = r * 2 + 'px';
    ripple.style.left = (e.clientX - rect.left - r) + 'px';
    ripple.style.top = (e.clientY - rect.top - r) + 'px';
    this.appendChild(ripple);
    requestAnimationFrame(() => { ripple.style.transform = 'scale(1)'; ripple.style.opacity = '0.9'; });
    setTimeout(() => { ripple.style.transition = 'opacity 500ms ease'; ripple.style.opacity = '0'; }, 300);
    setTimeout(() => ripple.remove(), 900);
});

// Modal: show Somali message when heart is tapped
const heartModal = document.getElementById('heartModal');
const modalClose = document.getElementById('modalClose');

function showModal() {
    heartModal.classList.add('show');
    heartModal.setAttribute('aria-hidden', 'false');
    document.getElementById('overlay').classList.add('show');
}

function closeModal() {
    heartModal.classList.remove('show');
    heartModal.setAttribute('aria-hidden', 'true');
    document.getElementById('overlay').classList.remove('show');
}

// Show modal on heart button (tap/click)
heartButton.addEventListener('click', function (e) {
    // delay slightly so ripple/sparkles run first
    setTimeout(() => showModal(), 260);
});

modalClose.addEventListener('click', closeModal);
heartModal.addEventListener('click', e => {
    if (e.target === heartModal) closeModal();
});

// close modal with Escape
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Gentle cursor-following mini hearts (performance-friendly)
let lastMove = 0;
window.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastMove < 120) return;
    lastMove = now;
    const h = document.createElement('div');
    h.className = 'sparkle';
    h.textContent = ['❤','💖'][Math.floor(Math.random()*2)];
    h.style.left = (e.clientX + 6) + 'px';
    h.style.top = (e.clientY + 6) + 'px';
    h.style.fontSize = (10 + Math.random()*12) + 'px';
    document.body.appendChild(h);
    setTimeout(() => { h.style.transition = 'opacity 700ms ease, transform 700ms ease'; h.style.opacity = '0'; h.style.transform = 'translateY(-10px) scale(0.8)'; }, 60);
    setTimeout(() => h.remove(), 900);
});