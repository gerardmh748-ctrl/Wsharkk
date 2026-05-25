// ========================================
// MENÚ MÓVIL - Toggle/Activación hamburguesa
// ========================================

/* Se ejecuta cuando el documento HTML está completamente cargado */
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el botón del menú hamburguesa
    const menuToggle = document.getElementById('menuToggle');
    // Obtiene el elemento del menú de navegación
    const navMenu = document.getElementById('navMenu');

    /* Si existen el botón y el menú, les añade funcionalidad */
    if (menuToggle && navMenu) {
        // Cuando hace click en el botón hamburguesa, activa/desactiva el menú
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');  // Añade o quita la clase 'active'
        });

        // Obtiene todos los enlaces del menú
        const navLinks = navMenu.querySelectorAll('.nav-link');
        
        // Para cada enlace del menú...
        navLinks.forEach(link => {
            // Cuando hace click en un enlace...
            link.addEventListener('click', function() {
                // Cierra el menú (quita la clase 'active')
                navMenu.classList.remove('active');
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL - Desplazamiento suave
    // ========================================

    /* Busca todos los enlaces que apunten a anchors (href="#...") */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Cuando hace click en cada enlace...
        anchor.addEventListener('click', function(e) {
            // Obtiene el destino del enlace (la sección a la que apunta)
            const href = this.getAttribute('href');
            
            /* Si el href no es solo "#" y existe el elemento de destino */
            if (href !== '#' && document.querySelector(href)) {
                // Previene el comportamiento por defecto (salto brusco)
                e.preventDefault();
                
                // Hace scroll suave hacia el elemento de destino
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',      // Efecto de desplazamiento suave
                    block: 'start'           // Alinea el elemento al inicio
                });
                
                // Cierra el menú si está abierto
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });

    // ========================================
    // INTERSECTION OBSERVER - Animaciones al hacer scroll
    // ========================================

    /* Configuración del observador de intersección */
    const observerOptions = {
        threshold: 0.1,                      // Activa cuando el 10% del elemento es visible
        rootMargin: '0px 0px -50px 0px'      // Área de detección (reduce 50px desde abajo)
    };

    /* Crea un observador que detecta elementos visibles */
    const observer = new IntersectionObserver(function(entries) {
        // Para cada elemento que entra en el área visible...
        entries.forEach(entry => {
            // Si el elemento está intersectando (visible en pantalla)...
            if (entry.isIntersecting) {
                // Lo hace visible cambiando su opacidad
                entry.target.style.opacity = '1';
                // Y lo coloca en su posición final (sin desplazamiento)
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    /* Busca todos los elementos que deben tener animación al scroll */
    document.querySelectorAll('.reveal-card, .reveal-text, .reveal-fade').forEach(el => {
        observer.observe(el);  // Comienza a observar cada elemento
    });

    // ========================================
    // CANVAS PARTICLE ANIMATION - Animación de partículas
    // ========================================

    // Obtiene el canvas (elemento para dibujar)
    const canvas = document.getElementById('particleCanvas');
    
    /* Si existe el canvas en la página */
    if (canvas) {
        // Obtiene el contexto 2D para dibujar en el canvas
        const ctx = canvas.getContext('2d');
        
        // Ajusta el tamaño del canvas al tamaño de la ventana
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Array para almacenar todas las partículas
        const particles = [];

        // Clase para crear partículas
        class Particle {
            constructor() {
                // Posición aleatoria en el canvas
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                
                // Tamaño aleatorio entre 0.5 y 2.5
                this.size = Math.random() * 2 + 0.5;
                
                // Velocidad de movimiento aleatoria (muy lenta)
                this.speedX = Math.random() * 0.5 - 0.25;  // Entre -0.25 y 0.25
                this.speedY = Math.random() * 0.5 - 0.25;
                
                // Transparencia aleatoria entre 0.2 y 0.7
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            // Método para actualizar la posición de la partícula
            update() {
                // Suma la velocidad a la posición (mueve la partícula)
                this.x += this.speedX;
                this.y += this.speedY;

                // Si la partícula sale del canvas por la izquierda, aparece por la derecha
                if (this.x < 0) this.x = canvas.width;
                // Si sale por la derecha, aparece por la izquierda
                if (this.x > canvas.width) this.x = 0;
                // Si sale por arriba, aparece por abajo
                if (this.y < 0) this.y = canvas.height;
                // Si sale por abajo, aparece por arriba
                if (this.y > canvas.height) this.y = 0;
            }

            // Método para dibujar la partícula en el canvas
            draw() {
                // Ajusta la transparencia global
                ctx.globalAlpha = this.opacity;
                // Color de la partícula: cian brillante
                ctx.fillStyle = '#00d9ff';
                // Comienza un nuevo camino
                ctx.beginPath();
                // Dibuja un círculo en la posición de la partícula
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                // Rellena el círculo
                ctx.fill();
                // Restaura la opacidad a normal
                ctx.globalAlpha = 1;
            }
        }

        // Crea 50 partículas iniciales
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Función para conectar partículas cercanas con líneas
        function connectParticles() {
            // Para cada partícula...
            for (let i = 0; i < particles.length; i++) {
                // Compara con todas las partículas posteriores
                for (let j = i + 1; j < particles.length; j++) {
                    // Calcula la distancia entre las dos partículas
                    const dist = Math.hypot(
                        particles[i].x - particles[j].x,
                        particles[i].y - particles[j].y
                    );

                    // Si las partículas están a menos de 100 píxeles...
                    if (dist < 100) {
                        // Dibuja una línea entre ellas (muy transparente)
                        ctx.globalAlpha = 0.1;
                        ctx.strokeStyle = '#00d9ff';  // Color de la línea
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);  // Inicia en primera partícula
                        ctx.lineTo(particles[j].x, particles[j].y);  // Termina en segunda partícula
                        ctx.stroke();
                        // Restaura la opacidad
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }

        // Función principal de animación (se ejecuta continuamente)
        function animate() {
            // Limpia el canvas (borra todo lo anterior)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Para cada partícula...
            particles.forEach(particle => {
                particle.update();  // Actualiza su posición
                particle.draw();    // La dibuja
            });

            // Dibuja las líneas conectando partículas cercanas
            connectParticles();
            
            // Solicita el próximo frame de animación
            requestAnimationFrame(animate);
        }

        // Inicia la animación
        animate();

        // Cuando la ventana cambia de tamaño...
        window.addEventListener('resize', function() {
            // Ajusta el canvas al nuevo tamaño
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ========================================
    // FORMULARIO DE CONTACTO
    // ========================================

    // Obtiene el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    /* Si existe el formulario */
    if (contactForm) {
        // Cuando se envía el formulario...
        contactForm.addEventListener('submit', async function(e) {
            // Previene que la página se recargue
            e.preventDefault();
            
            // Obtiene el elemento donde mostrar mensajes
            const formMessage = document.getElementById('formMessage');

            // Recopila los datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                empresa: document.getElementById('empresa').value,
                telefono: document.getElementById('telefono').value,
                servicio: document.getElementById('servicio').value,
                contexto: document.getElementById('contexto').value,
            };

            // Muestra un mensaje de éxito
            formMessage.textContent = '✓ ¡Gracias! Nos contactaremos pronto con detalles de tu consulta.';
            formMessage.style.color = '#00d9ff';  // Color cian

            // Limpia todos los campos del formulario
            contactForm.reset();

            // Después de 5 segundos, elimina el mensaje
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }

    // ========================================
    // SCROLL NAVBAR EFFECT - Efecto de sombra en la navbar
    // ========================================

    // Obtiene la barra de navegación
    const navbar = document.getElementById('navbar');
    
    // Cuando el usuario hace scroll...
    window.addEventListener('scroll', function() {
        // Si ha bajado más de 50 píxeles
        if (window.scrollY > 50) {
            // Añade una sombra a la navbar
            navbar.style.boxShadow = '0 5px 20px rgba(0, 217, 255, 0.1)';
        } else {
            // Si está al principio, quita la sombra
            navbar.style.boxShadow = 'none';
        }
    });

    // ========================================
    // BOTONES CTA - Funcionalidad de botones de llamada a la acción
    // ========================================

    // Obtiene todos los botones con clase 'btn-cta'
    const ctaButtons = document.querySelectorAll('.btn-cta');
    
    // Para cada botón...
    ctaButtons.forEach(button => {
        // Cuando hace click...
        button.addEventListener('click', function(e) {
            // Obtiene el destino del botón
            const href = this.getAttribute('href');
            
            // Si el botón tiene un enlace a un anchor (#...)
            if (href && href.startsWith('#')) {
                // Previene el comportamiento por defecto
                e.preventDefault();
                
                // Busca el elemento de destino
                const target = document.querySelector(href);
                
                // Si existe el elemento...
                if (target) {
                    // Hace scroll suave hacia él
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ========================================
    // CONTADOR DE ESTADÍSTICAS
    // ========================================

    // Función para animar los números de estadísticas
    function animateCounters() {
        // Obtiene todos los elementos que contienen números de estadísticas
        const stats = document.querySelectorAll('.stat-number');
        
        // Crea un observador para detectar cuando las estadísticas son visibles
        const observerStats = new IntersectionObserver(function(entries) {
            // Para cada estadística...
            entries.forEach(entry => {
                // Si es visible y aún no ha sido animada...
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    // Marca como animada (para no animar dos veces)
                    entry.target.classList.add('animated');
                    
                    // Obtiene el número final que debe mostrar
                    const finalValue = entry.target.textContent;
                    // Convierte a número entero
                    const number = parseInt(finalValue);

                    // Si es un número válido...
                    if (!isNaN(number)) {
                        let currentValue = 0;  // Comienza desde 0
                        // Incremento por cada frame (divide el total en 50 pasos)
                        const increment = number / 50;

                        // Interval que actualiza el contador cada 30ms
                        const updateCounter = setInterval(() => {
                            currentValue += increment;  // Suma el incremento
                            
                            // Si ya alcanzó o superó el número final...
                            if (currentValue >= number) {
                                // Muestra el valor final exacto
                                entry.target.textContent = finalValue;
                                // Detiene el interval
                                clearInterval(updateCounter);
                            } else {
                                // Si no, muestra el valor actual redondeado
                                // Mantiene símbolos especiales (+, %, s, etc.)
                                entry.target.textContent = Math.floor(currentValue) + 
                                    (finalValue.includes('+') ? '+' : 
                                     (finalValue.includes('%') ? '%' : 's'));
                            }
                        }, 30);
                    }
                }
            });
        }, { threshold: 0.5 });  // Se activa cuando el 50% es visible

        // Comienza a observar cada estadística
        stats.forEach(stat => observerStats.observe(stat));
    }

    // Inicia la animación de contadores
    animateCounters();
});
