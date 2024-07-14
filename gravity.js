document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gravityCanvas');
    const ctx = canvas.getContext('2d');
    const gravityWells = [];
    const particles = [];
    const gravityStrength = document.getElementById('gravityStrength');

    canvas.addEventListener('click', function(e) {
        addParticle(e.clientX, e.clientY);
    });

    function addGravityWell() {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let strength = parseFloat(gravityStrength.value);
        gravityWells.push({ x, y, strength });
    }

    function addParticle(x, y) {
        let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particles.push({ x, y, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, color });
    }

    function clearGravityWells() {
        gravityWells.length = 0;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        gravityWells.forEach(well => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(well.x, well.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });

        particles.forEach((particle, index) => {
            gravityWells.forEach(well => {
                let dx = well.x - particle.x;
                let dy = well.y - particle.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirection = { x: dx / distance, y: dy / distance };
                let forceMagnitude = well.strength / distance;
                particle.vx += forceDirection.x * forceMagnitude;
                particle.vy += forceDirection.y * forceMagnitude;
            });

            particle.x += particle.vx;
            particle.y += particle.vy;

            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Remove particle if it goes out of bounds
            if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
                particles.splice(index, 1);
            }
        });

        requestAnimationFrame(draw);
    }

    draw(); // Start the animation loop
    window.addGravityWell = addGravityWell; // Expose to global scope for button
    window.clearGravityWells = clearGravityWells;
});
