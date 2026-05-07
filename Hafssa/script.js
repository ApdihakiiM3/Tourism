// Loading animation
window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('.loading').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }, 1800); // short, pleasant loading
});

// Background music
const bgMusic = document.getElementById('bgMusic');
const muteButton = document.getElementById('muteButton');

if (bgMusic) {
    bgMusic.volume = 0.28; // gentle volume
    bgMusic.play().catch(() => {});
}

muteButton.addEventListener('click', function() {
    if (!bgMusic) return;
    if (bgMusic.muted) {
        bgMusic.muted = false;
        muteButton.textContent = '🔊';
    } else {
        bgMusic.muted = true;
        muteButton.textContent = '🔇';
    }
});

// Heart/button element
const heartButton = document.getElementById('heartButton');

// small palette for mixed-color accents
const SPARKLE_COLORS = ['#ff98d6','#ffd98b','#9ff5ff','#b89bff','#6fe1ff','#ffb3c9','#ffd1a6','#9be7ff'];

// Sparkle keyframes injector
const style = document.createElement('style');
style.textContent = `
@keyframes sparkle {
    0% { opacity: 1; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(2); }
}
`;
document.head.appendChild(style);

// show small overlay and sparkles on click
function createSparklesAround(el, count = 10) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = i % 2 ? '✨' : '❤';
        sparkle.style.color = SPARKLE_COLORS[Math.floor(Math.random()*SPARKLE_COLORS.length)];
        sparkle.style.position = 'absolute';
        document.body.appendChild(sparkle);
        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 90;
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
        }, 650 + Math.random()*300);
        setTimeout(() => { if (sparkle && sparkle.parentNode) sparkle.parentNode.removeChild(sparkle); }, 1250);
    }
}

// Heart click: ripple + sparkles + modal + overlay
if (heartButton) {
    heartButton.addEventListener('click', function(e) {
        // subtle press animation
        this.classList.add('active');
        setTimeout(() => this.classList.remove('active'), 220);

        // ripple
        const rect = this.getBoundingClientRect();
        const r = Math.max(rect.width, rect.height);
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = r * 2 + 'px';
        ripple.style.left = (e.clientX - rect.left - r) + 'px';
        ripple.style.top = (e.clientY - rect.top - r) + 'px';
        this.appendChild(ripple);
        requestAnimationFrame(() => { ripple.style.transform = 'scale(1)'; ripple.style.opacity = '0.9'; });
        setTimeout(() => { ripple.style.transition = 'opacity 500ms ease'; ripple.style.opacity = '0'; }, 320);
        setTimeout(() => { if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 900);

        // overlay & sparkles
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.classList.add('show');
        createSparklesAround(this, 18);
        setTimeout(() => { if (overlay) overlay.classList.remove('show'); }, 1600);

        // show modal shortly after
        setTimeout(() => showModal(), 260);
    });
}

// Smooth scroll helper
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Intersection observer for fade-in
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(function(entries){
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .images, footer').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Pulse class for heartbeat
if (heartButton) heartButton.classList.add('pulse');

// Floating symbols (dynamic)
function spawnFloatingSymbol() {
    const h = document.createElement('div');
    h.className = 'heart';
    const pool = ['✦','✨','✧','❤','✶'];
    h.textContent = pool[Math.floor(Math.random()*pool.length)];
    h.style.left = (6 + Math.random()*86) + '%';
    h.style.fontSize = (12 + Math.random()*20) + 'px';
    h.style.setProperty('--dur', (6 + Math.random()*7) + 's');
    document.querySelector('.floating-hearts').appendChild(h);
    setTimeout(() => { if (h && h.parentNode) h.parentNode.removeChild(h); }, 10000);
}
setInterval(spawnFloatingSymbol, 1000);

// little button sparkle on load
window.addEventListener('load', ()=>{
    const btn = document.querySelector('.heart-button');
    if (!btn) return;
    const sparkle = document.createElement('div');
    sparkle.className = 'btn-sparkle';
    // ensure the button can contain absolute children
    btn.style.position = btn.style.position || 'relative';
    btn.appendChild(sparkle);
    setTimeout(()=> sparkle.classList.add('show'), 450);
    setTimeout(()=> sparkle.classList.remove('show'), 1800);
});

// Image tilt
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
    img.addEventListener('mouseleave', () => { img.style.transform = ''; });
});

// Modal handling
const heartModal = document.getElementById('heartModal');
const modalClose = document.getElementById('modalClose');
function showModal() { if (!heartModal) return; heartModal.classList.add('show'); heartModal.setAttribute('aria-hidden','false'); document.getElementById('overlay')?.classList.add('show'); }
function closeModal(){ if (!heartModal) return; heartModal.classList.remove('show'); heartModal.setAttribute('aria-hidden','true'); document.getElementById('overlay')?.classList.remove('show'); }
modalClose?.addEventListener('click', closeModal);
heartModal?.addEventListener('click', e => { if (e.target === heartModal) closeModal(); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Ripple colors for sparkles created by cursor
let lastMove = 0;
window.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastMove < 120) return;
    lastMove = now;
    const h = document.createElement('div');
    h.className = 'sparkle';
    const pool = ['❤','✦','✨'];
    h.textContent = pool[Math.floor(Math.random()*pool.length)];
    h.style.left = (e.clientX + 6) + 'px';
    h.style.top = (e.clientY + 6) + 'px';
    h.style.fontSize = (9 + Math.random()*14) + 'px';
    h.style.color = SPARKLE_COLORS[Math.floor(Math.random()*SPARKLE_COLORS.length)];
    document.body.appendChild(h);
    setTimeout(() => { h.style.transition = 'opacity 700ms ease, transform 700ms ease'; h.style.opacity = '0'; h.style.transform = 'translateY(-10px) scale(0.8)'; }, 80);
    setTimeout(() => { if (h && h.parentNode) h.parentNode.removeChild(h); }, 900);
});

/* Floating sticker images: small 'sticker' elements using local images */
const STICKER_IMAGES = ['image1.jpg','image2.jpg','image3.jpg'];
const stickersRoot = document.querySelector('.stickers');
let stickerCount = 0;
function spawnSticker() {
    if (!stickersRoot) return;
    // limit on-screen stickers for performance
    const max = window.innerWidth < 480 ? 6 : window.innerWidth < 768 ? 8 : 12;
    if (stickerCount >= max) return;
    const idx = Math.floor(Math.random() * STICKER_IMAGES.length);
    const el = document.createElement('div');
    el.className = 'sticker';
    el.style.backgroundImage = `url(${STICKER_IMAGES[idx]})`;
    const size = Math.floor(36 + Math.random() * 80); // px
    el.style.setProperty('--s', size + 'px');
    const left = Math.floor(Math.random() * 92) + '%';
    el.style.left = left;
    const rot = Math.floor(-30 + Math.random() * 60);
    el.style.setProperty('--rot', rot + 'deg');
    const dur = 8 + Math.random() * 14;
    el.style.setProperty('--dur', dur + 's');
    stickersRoot.appendChild(el);
    stickerCount += 1;
    // remove after animation
    el.addEventListener('animationend', () => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
        stickerCount = Math.max(0, stickerCount - 1);
    });
}

// spawn some stickers at start and on interval
for (let i=0;i<6;i++) setTimeout(spawnSticker, i*450);
setInterval(spawnSticker, 1500);