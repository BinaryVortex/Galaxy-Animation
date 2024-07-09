const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Constants for stars
const numStars = 3000;
const starRadiusRange = [1, 3];
const starSpeedRange = [0.1, 0.5];

// Constants for planets
const numPlanets = 10;
const planetRadiusRange = [20, 50];
const planetSpeedRange = [0.01, 0.05];
const planetColors = ['#f0a', '#a0f', '#0af', '#fa0', '#0fa', '#ff0', '#0ff', '#f80', '#8f0', '#0f8'];
const planetOrbitSpeedRange = [-0.01, 0.01];

// Constants for nebulae
const numNebulae = 7;
const nebulaColors = ['#f0a', '#a0f', '#0af', '#fa0', '#0fa', '#f80', '#ff0'];
const nebulaRadiusRange = [100, 300];
const nebulaOpacityRange = [0.5, 0.9];

// Constants for shooting stars
const numShootingStars = 20;
const shootingStarSpeedRange = [2, 5];
const shootingStarLengthRange = [50, 100];

// Arrays to store objects
let stars = [];
let planets = [];
let nebulae = [];
let shootingStars = [];

// Function to initialize stars
function initializeStars() {
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: starRadiusRange[0] + Math.random() * (starRadiusRange[1] - starRadiusRange[0]),
            speed: starSpeedRange[0] + Math.random() * (starSpeedRange[1] - starSpeedRange[0])
        });
    }
}

// Function to initialize planets
function initializePlanets() {
    for (let i = 0; i < numPlanets; i++) {
        planets.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: planetRadiusRange[0] + Math.random() * (planetRadiusRange[1] - planetRadiusRange[0]),
            speed: planetSpeedRange[0] + Math.random() * (planetSpeedRange[1] - planetSpeedRange[0]),
            orbitRadius: 100 + Math.random() * (canvas.width / 2 - 100),
            orbitAngle: Math.random() * Math.PI * 2,
            color: planetColors[Math.floor(Math.random() * planetColors.length)],
            rotationSpeed: Math.random() * 0.02 - 0.01
        });
    }
}

// Function to initialize nebulae
function initializeNebulae() {
    for (let i = 0; i < numNebulae; i++) {
        nebulae.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: nebulaRadiusRange[0] + Math.random() * (nebulaRadiusRange[1] - nebulaRadiusRange[0]),
            color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
            opacity: nebulaOpacityRange[0] + Math.random() * (nebulaOpacityRange[1] - nebulaOpacityRange[0])
        });
    }
}

// Function to initialize shooting stars
function initializeShootingStars() {
    for (let i = 0; i < numShootingStars; i++) {
        shootingStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: shootingStarSpeedRange[0] + Math.random() * (shootingStarSpeedRange[1] - shootingStarSpeedRange[0]),
            length: shootingStarLengthRange[0] + Math.random() * (shootingStarLengthRange[1] - shootingStarLengthRange[0]),
            angle: Math.random() * Math.PI * 2,
            color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`
        });
    }
}

// Function to draw stars
function drawStars() {
    ctx.fillStyle = '#fff';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Function to draw planets
function drawPlanets() {
    planets.forEach(planet => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); // Translate to center of canvas
        ctx.rotate(planet.orbitAngle); // Rotate for orbit angle
        ctx.translate(planet.orbitRadius, 0); // Translate to orbit radius
        ctx.rotate(-planet.orbitAngle); // Reverse rotate to align planet
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update orbit angle for next frame
        planet.orbitAngle += planet.speed;
        planet.orbitAngle %= Math.PI * 2; // Keep angle within 0 to 2*PI range

        // Update rotation angle for spinning effect
        planet.rotation += planet.rotationSpeed;
    });
}

// Function to draw nebulae
function drawNebulae() {
    nebulae.forEach(nebula => {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = nebula.opacity; // Set opacity
        ctx.fillRect(nebula.x - nebula.radius, nebula.y - nebula.radius, nebula.radius * 2, nebula.radius * 2);
        ctx.globalAlpha = 1; // Reset global alpha
    });
}

// Function to draw shooting stars
function drawShootingStars() {
    shootingStars.forEach(star => {
        const x2 = star.x + Math.cos(star.angle) * star.length;
        const y2 = star.y + Math.sin(star.angle) * star.length;
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 1 + Math.random() * 2; // Vary line width for twinkling effect
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Update position for next frame
        star.x -= star.speed;
        star.y += star.speed * Math.tan(star.angle); // Add slight angle to shooting stars
        star.angle += Math.random() * 0.01 - 0.005; // Randomly change angle for natural look

        // Reset position if shooting star goes out of canvas
        if (star.x < -star.length || star.y > canvas.height + star.length) {
            star.x = canvas.width + star.length;
            star.y = Math.random() * canvas.height;
        }
    });
}

// Function to update animation
function updateAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawNebulae();
    drawPlanets();
    drawShootingStars();

    requestAnimationFrame(updateAnimation);
}

// Initialize objects and start animation
initializeStars();
initializePlanets();
initializeNebulae();
initializeShootingStars();
updateAnimation();
