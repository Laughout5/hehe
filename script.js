// ===== CONFIGURATION - EASILY CUSTOMIZABLE =====
const CONFIG = {
    requiredAttempts: 10,        // How many attempts before catch works
    baseFlowerSpeed: 0.5,        // Base speed (will increase with each touch)
    maxFlowerSpeed: 2.5,         // Maximum speed cap
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
let messageClickCount = 0;  // Track how many messages have been shown

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

// Track clicks/taps on the flower area
document.addEventListener('click', (e) => {
    if (gameState !== 'playing') return;
    
    // Check if click is near flower
    const flowerCenterX = flowerX + CONFIG.flowerSize / 2;
    const flowerCenterY = flowerY + CONFIG.flowerSize / 2;
    
    const distance = Math.sqrt(
        Math.pow(e.clientX - flowerCenterX, 2) + 
        Math.pow(e.clientY - flowerCenterY, 2)
    );
    
    if (distance < 70) {  // If clicked close to flower
        handleFlowerTouch();
    }
});

// Track touch for mobile
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    
    const touch = e.touches[0];
    const flowerCenterX = flowerX + CONFIG.flowerSize / 2;
    const flowerCenterY = flowerY + CONFIG.flowerSize / 2;
    
    const distance = Math.sqrt(
        Math.pow(touch.clientX - flowerCenterX, 2) + 
        Math.pow(touch.clientY - flowerCenterY, 2)
    );
    
    if (distance < 70) {
        handleFlowerTouch();
    }
}, { passive: false });

// Handle flower touch/click
function handleFlowerTouch() {
    if (gameState !== 'playing') return;
    
    // Increment attempt counter
    attemptCount++;
    attemptSpan.textContent = attemptCount;
    
    // Calculate current speed (increases with each attempt)
    const currentSpeed = Math.min(
        CONFIG.baseFlowerSpeed + (attemptCount * 0.15),  // Gets faster every touch
        CONFIG.maxFlowerSpeed
    );
    
    // Move flower AWAY from click position
    const flowerCenterX = flowerX + CONFIG.flowerSize / 2;
    const flowerCenterY = flowerY + CONFIG.flowerSize / 2;
    
    // Direction away from mouse/touch
    const angle = Math.atan2(flowerCenterY - mouseY, flowerCenterX - mouseX);
    
    // Move flower - distance increases with attempts
    const moveDistance = 20 + (attemptCount * 3);  // Moves farther each time
    flowerX += Math.cos(angle) * moveDistance * currentSpeed;
    flowerY += Math.sin(angle) * moveDistance * currentSpeed;
    
    // Keep flower in bounds
    flowerX = Math.max(10, Math.min(window.innerWidth - CONFIG.flowerSize - 10, flowerX));
    flowerY = Math.max(10, Math.min(window.innerHeight - CONFIG.flowerSize - 10, flowerY));
    
    // Update position
    flower.style.left = flowerX + 'px';
    flower.style.top = flowerY + 'px';
    
    // Quick animation
    flower.style.transform = 'scale(0.8)';
    setTimeout(() => {
        flower.style.transform = 'scale(1)';
    }, 150);
    
    // Show "whoosh" effect
    showQuickMessage(`💨 Jump ${attemptCount}!`);
    
    // Check if caught
    if (attemptCount >= CONFIG.requiredAttempts) {
        catchFlower();
    }
}

// Show quick message that disappears
function showQuickMessage(text) {
    const msg = document.createElement('div');
    msg.style.position = 'fixed';
    msg.style.left = mouseX + 'px';
    msg.style.top = (mouseY - 40) + 'px';
    msg.style.background = 'rgba(255, 200, 220, 0.9)';
    msg.style.padding = '5px 15px';
    msg.style.borderRadius = '20px';
    msg.style.fontSize = '16px';
    msg.style.color = '#c44569';
    msg.style.border = '1px solid white';
    msg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    msg.style.zIndex = '1000';
    msg.style.pointerEvents = 'none';
    msg.style.transition = 'opacity 0.5s';
    msg.textContent = text;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 500);
    }, 800);
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
    flowerElement.dataset.messageIndex = messageIndex;
    
    // Add click handler
    flowerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Increment message counter
        messageClickCount++;
        
        // Show message with counter
        showMessageWithCounter(
            flowerElement.dataset.message, 
            messageClickCount, 
            CONFIG.messages.length
        );
        
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

// ===== SHOW MESSAGE WITH COUNTER =====
function showMessageWithCounter(msg, currentNum, totalNum) {
    // Remove any existing popup
    const oldPopup = document.querySelector('.message-popup');
    if (oldPopup) oldPopup.remove();
    
    // Create new popup
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    
    // Main message
    const messageText = document.createElement('div');
    messageText.style.fontSize = '22px';
    messageText.style.marginBottom = '5px';
    messageText.textContent = msg;
    
    // Counter
    const counter = document.createElement('div');
    counter.className = 'popup-counter';
    counter.textContent = `✨ Message ${currentNum} of ${totalNum} ✨`;
    
    popup.appendChild(messageText);
    popup.appendChild(counter);
    
    document.body.appendChild(popup);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.5s';
        setTimeout(() => popup.remove(), 500);
    }, 4000);
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

// Reset game (click anywhere on background)
container.addEventListener('click', (e) => {
    if (e.target === container && gameState === 'celebrating') {
        // Reset game
        gameState = 'playing';
        attemptCount = 0;
        attemptSpan.textContent = '0';
        messageClickCount = 0;  // Reset message counter
        flower.style.opacity = '1';
        celebrationMsg.classList.add('hidden');
        document.body.style.background = 'linear-gradient(145deg, #fbe9f0 0%, #e0f2e9 100%)';
        
        // Clear floating flowers
        document.querySelectorAll('.floating-flower').forEach(f => f.remove());
    }
});