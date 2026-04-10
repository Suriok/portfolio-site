document.addEventListener("DOMContentLoaded", () => {

    initWaveBackground();
    initNameScramble({ disabled: false });
    initScrollReveal({ disabled: false });
});

function initWaveBackground() {
    const canvas = document.getElementById("wave-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }

    function drawWave(time, yOffset, color, amplitude, wavelength, speed) {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 2) {
            const y =
                yOffset +
                Math.sin(x * wavelength + time * speed) * amplitude;

            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fill();
    }

    function animate(time) {
        ctx.clearRect(0, 0, width, height);

        drawWave(time * 0.001, height * 0.55, "rgba(124, 58, 237, 0.30)", 40, 0.012, 1.2);
        drawWave(time * 0.001, height * 0.65, "rgba(6, 182, 212, 0.24)", 32, 0.010, 1.0);
        drawWave(time * 0.001, height * 0.75, "rgba(236, 72, 153, 0.18)", 28, 0.014, 1.4);

        requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    requestAnimationFrame(animate);
}


function initNameScramble({ disabled }) {
    const scrambleElement = document.getElementById("scramble-name");
    if (!scrambleElement) return;
    if (disabled) return;

    const chars = "AGHIJKTUVWXYZefghpqrstu012349@#$%";
    const target = "Golyak";
    let frame = 0;
    let intervalId = null;

    function scramble() {
        let output = "";

        for (let index = 0; index < target.length; index += 1) {
            if (index < Math.floor(frame / 3)) {
                output += target[index];
            } else {
                output += chars[Math.floor(Math.random() * chars.length)];
            }
        }

        scrambleElement.textContent = output;
        frame += 1;

        if (frame > target.length * 3 + 10) {
            clearInterval(intervalId);
            scrambleElement.textContent = target;
        }
    }

    function startScramble(speed = 40) {
        clearInterval(intervalId);
        frame = 0;
        intervalId = window.setInterval(scramble, speed);
    }

    window.setTimeout(() => startScramble(40), 500);
    scrambleElement.parentElement?.addEventListener("mouseenter", () => startScramble(35));
}

function initScrollReveal({ disabled }) {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    if (disabled) {
        revealElements.forEach((element) => element.classList.add("in"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) return;

                const delay = parseFloat(entry.target.style.transitionDelay || "0") * 1000;

                window.setTimeout(() => {
                    entry.target.classList.add("in");
                }, index * 60 + delay);

                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.08 }
    );

    revealElements.forEach((element) => observer.observe(element));
}