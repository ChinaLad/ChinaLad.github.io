// Ensure the noise library is initialized (required by noisejs)
noise.seed(Math.random());

const canvas = document.getElementById("noiseCanvas");
const ctx = canvas.getContext("2d");

let w, h;

// Function to handle resizing smoothly
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize(); // Initial sizing

// ----------------------------------------------------
// CONFIGURATION (Adjust these values to change the look)
// ----------------------------------------------------
const config = {
    noiseSpeed: 0.008, // How fast it animates
    noiseScale: 200,   // "Zoom" level of the noise
    dotSize: 4,        // Size of the pixels/shapes
    gap: 4,            // Space between pixels
    shape: 1           // 0 = Square, 1 = Circle, 2 = Triangle, 3 = Alternating Triangles
};

let nt = 0; // Time variable for the noise

// Linear interpolation helper
function lerp(x1, x2, n) {
    return (1 - n) * x1 + n * x2;
}

const rootStyles = getComputedStyle(document.documentElement);
const themeBgColor = rootStyles.getPropertyValue('--bg').trim() || '#fdfdfd';
const themeNoiseColor = rootStyles.getPropertyValue('--accent').trim() || '#1a1a1c';

function draw() {
    // Clear the background every frame
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = themeBgColor;
    ctx.fillRect(0, 0, w, h);

    nt += config.noiseSpeed;
    const step = config.dotSize + config.gap;

    ctx.fillStyle = themeNoiseColor;

    // Loop through the grid
    for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
            
            // Generate Perlin noise value for this coordinate
            let yn = noise.perlin3(y / config.noiseScale, x / config.noiseScale, nt) * 20;

            ctx.beginPath();
            
            ctx.globalAlpha = Math.max(0, Math.min(1, yn * 0.04));

            // Draw the shape based on config
            if (config.shape === 0) {
                ctx.fillRect(x, y, config.dotSize, config.dotSize);
            } else if (config.shape === 1) {
                ctx.arc(x, y, config.dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (config.shape === 2) {
                ctx.moveTo(x + (config.dotSize / 2), y + config.dotSize);
                ctx.lineTo(x, y);
                ctx.lineTo(x + config.dotSize, y);
                ctx.fill();
            } else if (config.shape === 3) {
                if (y % (step * 2) === step) {
                    ctx.moveTo(x + (config.dotSize / 2), y);
                    ctx.lineTo(x + config.dotSize, y + config.dotSize);
                    ctx.lineTo(x, y + config.dotSize);
                } else {
                    ctx.moveTo(x + (config.dotSize / 2), y + config.dotSize);
                    ctx.lineTo(x, y);
                    ctx.lineTo(x + config.dotSize, y);
                }
                ctx.fill();
            }
            ctx.closePath();
        }
    }
}

// The animation loop
function render() {
    draw();
    requestAnimationFrame(render);
}

// Start the animation
render();


const slider = document.getElementById('slider');
let scrollAmount = 0;

function autoScroll() {
    const slideWidth = slider.clientWidth;
    const maxScroll = slider.scrollWidth - slideWidth;

    if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' }); // Loop back to start
    } else {
        slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
    }
}

// Start auto-scrolling every 5 seconds
let slideInterval = setInterval(autoScroll, 10000);

// Pause auto-scroll when the user interacts with it manually
slider.addEventListener('mousedown', () => clearInterval(slideInterval));
slider.addEventListener('touchstart', () => clearInterval(slideInterval));
