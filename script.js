// ═══ INTRO SCREEN ═══
(function() {
    const screen  = document.getElementById('introScreen');
    const enterBtn = document.getElementById('introEnter');

    // Particle canvas
    const canvas = document.getElementById('introCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 14000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x:  Math.random() * canvas.width,
                y:  Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r:  Math.random() * 1.5 + 0.5,
                a:  Math.random() * 0.5 + 0.1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56,189,248,${p.a})`;
            ctx.fill();
        });

        // draw connecting lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    // Dismiss intro
    function dismissIntro() {
        screen.classList.add('hiding');
        cancelAnimationFrame(animId);
        setTimeout(() => screen.classList.add('hidden'), 850);
        document.removeEventListener('keydown', dismissIntro);
    }

    enterBtn.addEventListener('click', dismissIntro);

    // also dismiss on any key press (after boot sequence finishes)
    setTimeout(() => {
        document.addEventListener('keydown', dismissIntro);
    }, 3000);
})();