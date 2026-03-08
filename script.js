// ===== CONFIGURATION - EASILY CUSTOMIZABLE =====
const CONFIG = {
    requiredAttempts: 10,        // How many attempts before catch works
    flowerSpeed: 0.7,            // How fast flower moves away (0.1-1)
    flowerSize: 100,             // Width/height of flower in pixels
    
    // 🌸 FRIENDSHIP MESSAGES - ADD YOUR OWN HERE!
    messages: [
        "🌸 You're my sunshine on cloudy days",
        "💕 Remember when we laughed till 3am?",
        "🌼 Best adventures happen with you",
        "✨ You make everything more magical",
        "🌺 Grateful for you every single day",
        "💫 You're the sister I chose",
        "🌷 Your smile lights up my world",
        "🌟 Thanks for being you",
        "🌿 Home is wherever you are",
        "💖 This flower is shy, but my love for you isn't",
        "🦋 You're my favorite notification",
        "🌹 Even flowers bloom brighter when you're near",
        "☀️ You're made of sunshine and stardust",
        "🎵 You're the song in my heart",
        "🍀 Lucky to have you in my life"
    ],
    
    // Flower emojis for variety
    flowerEmojis: ["🌸", "🌼", "🌻", "🌺", "🌸", "🌷", "🌹", "💐", "🌸", "🌸"]
};
// ==============================================

// ===== GLOBAL VARIABLES =====
let attemptCount = 0;
let gameState = 'playing'; // 'playing' or 'celebrating'
let mouseX = 0, mouseY = 0;
let flowerX = window.innerWidth / 2 - 50;
let flowerY = window.innerHeight / 2 - 50;
let gardenFlowers = [];

// DOM Elements
const flower = document.getElementById('shy-flower');
const attemptSpan = document.getElementById('attempt-number');
const celebrationMsg = document.getElementById('celebration-message');
const container = document.getElementById('game-container');

// ===== INITIAL SETUP =====
flower.style.left = flowerX + 'px';
flower.style.top = flowerY + 'px';

// ===== CORE GAME FUNCTIONS =====

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    checkAndMoveFlower();
});

// Track touch for mobile
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
    checkAndMoveFlower();
}, { passive: false });

// Main game logic
function checkAndMoveFlower() {
    if (gameState !== 'playing') return;

    // Get flower center position
    const flowerCenterX = flowerX + CONFIG.flowerSize / 2;
    const flowerCenterY = flowerY + CONFIG.flowerSize / 2;
    
    // Calculate distance from mouse to flower center
    const distance = Math.sqrt(
        Math.pow(mouseX - flowerCenterX, 2) + 
        Math.pow(mouseY - flowerCenterY, 2)
    );
    
    // If mouse is close, move flower away
    if (distance < 100) {
        // Direction away from mouse
        const angle = Math.atan2(flowerCenterY - mouseY, flowerCenterX - mouseX);
        
        // Move flower
        flowerX += Math.cos(angle) * 15 * CONFIG.flowerSpeed;
        flowerY += Math.sin(angle) * 15 * CONFIG.flowerSpeed;
        
        // Keep flower in bounds
        flowerX = Math.max(10, Math.min(window.innerWidth - CONFIG.flowerSize - 10, flowerX));
        flowerY = Math.max(10, Math.min(window.innerHeight - CONFIG.flowerSize - 10, flowerY));
        
        // Update position
        flower.style.left = flowerX + 'px';
        flower.style.top = flowerY + 'px';
        
        // Increment attempt counter
        attemptCount++;
        attemptSpan.textContent = attemptCount;
        
        // Quick animation
        flower.style.transform = 'scale(0.9)';
        setTimeout(() => {
            flower.style.transform = 'scale(1)';
        }, 100);
        
        // Check if caught
        if (attemptCount >= CONFIG.requiredAttempts) {
            catchFlower();
        }
    }
}

// ===== CATCH FLOWER - THE BIG MOMENT! =====
function catchFlower() {
    gameState = 'celebrating';
    
    // Hide the shy flower
    flower.style.opacity = '0';
    flower.style.transition = 'opacity 0.5s';
    
    // Show celebration message
    celebrationMsg.classList.remove('hidden');
    
    // 🌸 EXPLODE INTO FLOWERS!
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFloatingFlower();
        }, i * 30); // Cascade effect
    }
    
    // Change background to celebrate
    document.body.style.background = 'linear-gradient(145deg, #ffe6f0 0%, #d4f0e0 100%)';
}

// ===== CREATE FLOATING FLOWER =====
function createFloatingFlower() {
    const flowerEmoji = CONFIG.flowerEmojis[
        Math.floor(Math.random() * CONFIG.flowerEmojis.length)
    ];
    
    const flowerElement = document.createElement('div');
    flowerElement.className = 'floating-flower';
    flowerElement.textContent = flowerEmoji;
    
    // Random starting position (around center)
    flowerElement.style.left = (window.innerWidth / 2 - 50 + (Math.random() * 200 - 100)) + 'px';
    flowerElement.style.top = (window.innerHeight / 2 - 50 + (Math.random() * 200 - 100)) + 'px';
    
    // Random rotation
    flowerElement.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Store message for this flower
    const messageIndex = Math.floor(Math.random() * CONFIG.messages.length);
    flowerElement.dataset.message = CONFIG.messages[messageIndex];
    
    // Add click handler
    flowerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        showMessage(flowerElement.dataset.message);
        
        // Add to garden
        addToGarden(flowerElement.textContent);
        
        // Remove flower
        flowerElement.remove();
    });
    
    container.appendChild(flowerElement);
    
    // Remove after animation ends
    setTimeout(() => {
        if (flowerElement.parentNode) {
            flowerElement.remove();
        }
    }, 8000);
}

// ===== SHOW MESSAGE POPUP =====
function showMessage(msg) {
    // Remove any existing popup
    const oldPopup = document.querySelector('.message-popup');
    if (oldPopup) oldPopup.remove();
    
    // Create new popup
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.textContent = msg;
    
    document.body.appendChild(popup);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.5s';
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// ===== ADD FLOWER TO GARDEN =====
function addToGarden(flowerEmoji) {
    // Create garden flower
    const gardenFlower = document.createElement('div');
    gardenFlower.className = 'garden-flower';
    gardenFlower.textContent = flowerEmoji;
    
    // Position along bottom
    const leftPos = 20 + (gardenFlowers.length * 40) % (window.innerWidth - 100);
    gardenFlower.style.left = leftPos + 'px';
    
    document.body.appendChild(gardenFlower);
    gardenFlowers.push(gardenFlower);
    
    // Store in localStorage to remember garden
    saveGarden();
}

// ===== SAVE/LOAD GARDEN (optional) =====
function saveGarden() {
    const gardenData = gardenFlowers.map(f => f.textContent);
    localStorage.setItem('friendshipGarden', JSON.stringify(gardenData));
}

function loadGarden() {
    const saved = localStorage.getItem('friendshipGarden');
    if (saved) {
        const gardenData = JSON.parse(saved);
        gardenData.forEach((emoji, index) => {
            const gardenFlower = document.createElement('div');
            gardenFlower.className = 'garden-flower';
            gardenFlower.textContent = emoji;
            gardenFlower.style.left = (20 + index * 40) + 'px';
            document.body.appendChild(gardenFlower);
            gardenFlowers.push(gardenFlower);
        });
    }
}

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
    // Keep flower in bounds on resize
    flowerX = Math.min(flowerX, window.innerWidth - CONFIG.flowerSize - 10);
    flowerY = Math.min(flowerY, window.innerHeight - CONFIG.flowerSize - 10);
    flower.style.left = flowerX + 'px';
    flower.style.top = flowerY + 'px';
});

// ===== INITIALIZE =====
window.addEventListener('load', () => {
    loadGarden();
    console.log('🌸 Shy Flower is ready to play!');
});

// For debugging - click anywhere to reset (remove in final version)
container.addEventListener('click', (e) => {
    if (e.target === container && gameState === 'celebrating') {
        // Reset game
        gameState = 'playing';
        attemptCount = 0;
        attemptSpan.textContent = '0';
        flower.style.opacity = '1';
        celebrationMsg.classList.add('hidden');
        document.body.style.background = 'linear-gradient(145deg, #fbe9f0 0%, #e0f2e9 100%)';
        
        // Clear floating flowers
        document.querySelectorAll('.floating-flower').forEach(f => f.remove());
    }
});