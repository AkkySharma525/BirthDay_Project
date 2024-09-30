// Countdown timer and surprise reveal logic
let countdownElement = document.getElementById('countdown');
let startButton = document.getElementById('start-btn');
let birthdayMessage = document.getElementById('birthday-message');
let big20 = document.getElementById('big-20');
let videoContainer = document.getElementById('video-container');
let photoGallery = document.getElementById('photo-gallery');
let fireworksCanvas = document.getElementById('fireworks');
let floatingHearts = document.getElementById('floating-hearts');

// Fireworks, hearts, balloons effects
function triggerAnimations() {
    fireworksCanvas.style.display = 'block';
    floatingHearts.style.display = 'block';
    startFireworks();
    startFloatingHearts();
}

// Function to start fireworks animation
// Fireworks variables
let canvas, ctx, fireworks = [], particles = [], hue = 120;

function startFireworks() {
    // Create canvas and context
    canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    
    // Resize canvas to fit full window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fireworks loop
    window.requestAnimationFrame(loopFireworks);

    // Handle window resizing
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Firework class
function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = Math.random() * 30 + 50;
    this.targetRadius = 1;
}

// Update firework
Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }
    this.speed *= this.acceleration;
    let vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
}

// Draw firework
Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
}

// Particle class
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 10 + 1;
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = Math.random() * 360;
    this.brightness = Math.random() * 50 + 50;
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.015;
}

// Update particle
Particle.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

// Draw particle
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

// Calculate distance for fireworks to travel
function calculateDistance(x1, y1, x2, y2) {
    let a = x2 - x1,
        b = y2 - y1;
    return Math.sqrt(a * a + b * b);
}

// Create particles when the firework explodes
function createParticles(x, y) {
    let particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// Main fireworks loop
function loopFireworks() {
    window.requestAnimationFrame(loopFireworks);
    hue += 0.5;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }

    // Launch new fireworks
    if (Math.random() < 0.05) {
        let startX = canvas.width / 2,
            startY = canvas.height,
            targetX = Math.random() * canvas.width,
            targetY = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(startX, startY, targetX, targetY));
    }
}


// Function to start floating hearts animation
// Function to start floating hearts animation
function startFloatingHearts() {
  const heartContainer = document.getElementById('floating-hearts');
  
  setInterval(function() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // Random duration between 3 and 5 seconds
      heartContainer.appendChild(heart);

      // Remove heart after animation ends
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, 500);
}


// Countdown function
function startCountdown(endDate, callback) {
    let countdownInterval = setInterval(() => {
        let now = new Date().getTime();
        let distance = endDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            callback(); // Trigger after countdown ends
        }

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// 3-second countdown after main countdown ends
function finalCountdown() {
    let seconds = 3;
    let soundEffect = new Audio('your-sound-effect.mp3'); // Add sound effect
    let finalCountdownInterval = setInterval(() => {
        countdownElement.innerHTML = seconds + 's';
        soundEffect.play();
        seconds--;

        if (seconds < 0) {
            clearInterval(finalCountdownInterval);
            triggerAnimations();
            showBirthdayContent();
        }
    }, 1000);
}

// Display the final birthday content
function showBirthdayContent() {
    birthdayMessage.style.display = 'block';
    big20.style.display = 'block';
    videoContainer.style.display = 'block';
    photoGallery.style.display = 'block';
}

// Start the countdown on button click
startButton.addEventListener('click', () => {
    document.getElementById('surprise-btn').style.display = 'none';
    document.getElementById('countdown-container').style.display = 'block';

    let endDate = new Date('Sept 29, 2024 22:8:00').getTime();
    startCountdown(endDate, finalCountdown);
});
