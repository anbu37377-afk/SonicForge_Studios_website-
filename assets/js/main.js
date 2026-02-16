/**
 * SONICFORGE STUDIO - CINEMATIC ENGINE
 * Refined anti-gravity particle system & sound energy streaks.
 */

class CinematicEngine {
    constructor() {
        this.canvases = document.querySelectorAll('.music-canvas');
        if (this.canvases.length === 0) return;

        this.instances = Array.from(this.canvases).map(canvas => ({
            canvas: canvas,
            ctx: canvas.getContext('2d'),
            particles: [],
            beams: [],
            color: canvas.getAttribute('data-color') || '255, 90, 31'
        }));

        this.particleCount = 40;
        this.beamCount = 3;

        this.resize();
        this.instances.forEach(inst => this.initInstance(inst));
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.instances.forEach(inst => this.initInstance(inst));
        });
    }

    resize() {
        this.instances.forEach(inst => {
            if (inst.canvas && inst.canvas.parentElement) {
                const parent = inst.canvas.parentElement;
                inst.canvas.width = parent.offsetWidth;
                inst.canvas.height = parent.offsetHeight;
            }
        });
    }

    initInstance(inst) {
        inst.particles = [];
        inst.beams = [];

        for (let i = 0; i < this.particleCount; i++) {
            inst.particles.push({
                x: Math.random() * inst.canvas.width,
                y: Math.random() * inst.canvas.height,
                size: Math.random() * 8 + 2, // Larger, more visible "bubbles"
                speedY: Math.random() * -0.4 - 0.2, // Faster upward drift
                speedX: Math.random() * 0.6 - 0.3,  // More horizontal float
                opacity: Math.random() * 0.4 + 0.1,
                pulse: Math.random() * 0.008 + 0.003
            });
        }

        for (let i = 0; i < this.beamCount; i++) {
            inst.beams.push({
                x: Math.random() * inst.canvas.width,
                width: Math.random() * 600 + 300,
                opacity: 0,
                targetOpacity: Math.random() * 0.08 + 0.03,
                speed: Math.random() * 0.0015 + 0.0008,
                color: Math.random() > 0.5 ? '255, 75, 40' : '230, 40, 80' // More attractive, vibrant reds/oranges
            });
        }
    }

    draw() {
        this.instances.forEach(inst => {
            const { ctx, canvas, particles, beams } = inst;
            if (!ctx || !canvas || canvas.width === 0 || canvas.height === 0) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            beams.forEach(beam => {
                const gradient = ctx.createLinearGradient(beam.x, 0, beam.x + beam.width, canvas.height);
                gradient.addColorStop(0, `rgba(${beam.color}, 0)`);
                gradient.addColorStop(0.5, `rgba(${beam.color}, ${beam.opacity})`);
                gradient.addColorStop(1, `rgba(${beam.color}, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                beam.opacity += beam.speed;
                if (beam.opacity >= beam.targetOpacity || beam.opacity <= 0) beam.speed *= -1;
            });

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                // Theme-aware particle color
                const theme = document.body.getAttribute('data-theme');
                const particleColor = theme === 'light' ? '255, 140, 0' : inst.color;

                ctx.fillStyle = theme === 'light'
                    ? `rgba(${particleColor}, ${p.opacity * 1.2})`
                    : `rgba(${particleColor}, ${p.opacity * 1.5})`;
                ctx.fill();

                p.y += p.speedY;
                p.x += p.speedX;
                p.opacity += p.pulse;

                if (p.opacity > (theme === 'light' ? 0.4 : 0.5) || p.opacity < 0.1) p.pulse *= -1;

                // Seamless looping
                if (p.y < -20) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
            });
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

/**
 * TEXT SCRAMBLE ENGINE
 * Decodes text with random characters for a premium digital effect.
 */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-primary">${char}</span>`;
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
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// UI & Theme Logic
const SonicUI = {
    init() {
        this.handleTheme();
        this.handleScroll();
        this.revealOnScroll();
        this.initLightAtmosphere();
    },

    initLightAtmosphere() {
        if (!document.querySelector('.light-atmosphere')) {
            const atmos = document.createElement('div');
            atmos.className = 'light-atmosphere';
            for (let i = 0; i < 6; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'atmos-bubble';
                atmos.appendChild(bubble);
            }
            document.body.prepend(atmos);
        }
    },

    handleTheme() {
        const toggle = document.getElementById('theme-toggle');
        const body = document.body;

        // Load saved theme
        const savedTheme = localStorage.getItem('sonic-theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        toggle?.addEventListener('click', () => {
            const current = body.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', next);
            localStorage.setItem('sonic-theme', next);
            this.updateThemeIcon(next);
        });
    },

    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    },

    handleScroll() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    },

    revealOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Handle scramble if class exists
                    if (entry.target.classList.contains('scramble-text')) {
                        const fx = new TextScramble(entry.target);
                        fx.setText(entry.target.innerText);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-focus, .reveal-tracking').forEach(el => observer.observe(el));
    },

    spotlight() {
        const sections = document.querySelectorAll('.immersive-finale');
        sections.forEach(section => {
            section.addEventListener('mousemove', e => {
                const rect = section.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                section.style.setProperty('--spot-x', `${x}%`);
                section.style.setProperty('--spot-y', `${y}%`);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        new CinematicEngine();
        SonicUI.init();
        SonicUI.spotlight();
    } catch (e) {
        console.error("Critical Main JS Error:", e);
        // Emergency Override: Show all content if JS fails
        document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-focus, .reveal-tracking').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('active');
        });
    }
});
