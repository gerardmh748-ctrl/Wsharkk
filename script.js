// ========================================
// MENÚ MÓVIL - Toggle hamburguesa
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL - Desplazamiento suave
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });

    // ========================================
    // INTERSECTION OBSERVER - Animaciones al scroll
    // ========================================

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

    document.querySelectorAll('.reveal-card, .reveal-text, .reveal-fade').forEach(el => {
        observer.observe(el);
    });

    // ========================================
    // CANVAS PARTICLE ANIMATION
    // ========================================

    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#00d9ff';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Crear partículas
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Conectar partículas cercanas
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(
                        particles[i].x - particles[j].x,
                        particles[i].y - particles[j].y
                    );

                    if (dist < 100) {
                        ctx.globalAlpha = 0.1;
                        ctx.strokeStyle = '#00d9ff';
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        // Animar
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();

        // Redimensionar canvas
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ========================================
    // FORMULARIO DE CONTACTO
    // ========================================

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');

            // Recopilar datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                empresa: document.getElementById('empresa').value,
                telefono: document.getElementById('telefono').value,
                servicio: document.getElementById('servicio').value,
                contexto: document.getElementById('contexto').value,
            };

            // Aquí puedes enviar los datos a un servidor
            // Por ahora, mostramos un mensaje de éxito
            formMessage.textContent = '✓ ¡Gracias! Nos contactaremos pronto con detalles de tu consulta.';
            formMessage.style.color = '#00d9ff';

            // Limpiar formulario
            contactForm.reset();

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }

    // ========================================
    // SCROLL NAVBAR EFFECT
    // ========================================

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 217, 255, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ========================================
    // BOTONES CTA - Funcionalidad
    // ========================================

    const ctaButtons = document.querySelectorAll('.btn-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ========================================
    // CONTADOR DE ESTADÍSTICAS
    // ========================================

    function animateCounters() {
        const stats = document.querySelectorAll('.stat-number');
        const observerStats = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const finalValue = entry.target.textContent;
                    const number = parseInt(finalValue);

                    if (!isNaN(number)) {
                        let currentValue = 0;
                        const increment = number / 50;

                        const updateCounter = setInterval(() => {
                            currentValue += increment;
                            if (currentValue >= number) {
                                entry.target.textContent = finalValue;
                                clearInterval(updateCounter);
                            } else {
                                entry.target.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : (finalValue.includes('%') ? '%' : 's'));
                            }
                        }, 30);
                    }
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observerStats.observe(stat));
    }

    animateCounters();
});