const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const bear = document.getElementById('bear');
const celebration = document.getElementById('celebration');
const buttonsContainer = document.querySelector('.buttons-container');

let bearIsChasing = false;
let yesClicked = false;
let buttonPosition = { x: 0, y: 0 };

// Initialize button position
const initialRect = noBtn.getBoundingClientRect();
buttonPosition.x = initialRect.left;
buttonPosition.y = initialRect.top;

// Handle mouse movement near the No button
document.addEventListener('mousemove', (e) => {
    if (yesClicked) return;

    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distance = Math.sqrt(
        Math.pow(mouseX - btnCenterX, 2) +
        Math.pow(mouseY - btnCenterY, 2)
    );

    // If mouse gets within 180px of the button (even when on top)
    if (distance < 180) {
        if (!bearIsChasing) {
            bearIsChasing = true;
            bear.style.opacity = '1';
        }
        runAwayFromMouse(mouseX, mouseY, btnCenterX, btnCenterY);
    } else if (bearIsChasing) {
        // Mouse moved away, hide bear after a delay
        setTimeout(() => {
            const newRect = noBtn.getBoundingClientRect();
            const newBtnCenterX = newRect.left + newRect.width / 2;
            const newBtnCenterY = newRect.top + newRect.height / 2;
            const newDistance = Math.sqrt(
                Math.pow(mouseX - newBtnCenterX, 2) +
                Math.pow(mouseY - newBtnCenterY, 2)
            );
            if (newDistance > 180) {
                bearIsChasing = false;
                bear.style.opacity = '0';
            }
        }, 500);
    }
});

function runAwayFromMouse(mouseX, mouseY, btnX, btnY) {
    // Calculate direction away from mouse
    const dx = btnX - mouseX;
    const dy = btnY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize and apply speed (much faster!)
    const speed = 25;
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    // Update button position
    buttonPosition.x += moveX;
    buttonPosition.y += moveY;

    // Keep button within window bounds with better corner escape
    const padding = 50;
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 100;

    // If hitting a wall, bounce away from it
    if (buttonPosition.x <= padding) {
        buttonPosition.x = padding + 100; // Jump away from left edge
    } else if (buttonPosition.x >= maxX) {
        buttonPosition.x = maxX - 100; // Jump away from right edge
    }

    if (buttonPosition.y <= padding) {
        buttonPosition.y = padding + 80; // Jump away from top edge
    } else if (buttonPosition.y >= maxY) {
        buttonPosition.y = maxY - 80; // Jump away from bottom edge
    }

    // Apply position to button
    noBtn.style.position = 'fixed';
    noBtn.style.left = buttonPosition.x + 'px';
    noBtn.style.top = buttonPosition.y + 'px';

    // Position bear behind the button (carrying it)
    bear.style.position = 'fixed';
    bear.style.left = (buttonPosition.x - 60) + 'px';
    bear.style.top = (buttonPosition.y - 10) + 'px';

    // Flip bear based on direction
    if (moveX > 0) {
        bear.style.transform = 'scaleX(1)';
    } else {
        bear.style.transform = 'scaleX(-1)';
    }
}

// Handle No button click - teleport away!
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    teleportButton();
});

function teleportButton() {
    // Random position on screen
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;

    buttonPosition.x = Math.random() * maxX + 50;
    buttonPosition.y = Math.random() * maxY + 50;

    noBtn.style.left = buttonPosition.x + 'px';
    noBtn.style.top = buttonPosition.y + 'px';

    // Flash effect
    noBtn.style.opacity = '0.3';
    setTimeout(() => {
        noBtn.style.opacity = '1';
    }, 100);
}

// Handle Yes button click
yesBtn.addEventListener('click', () => {
    yesClicked = true;

    // Hide buttons and bear
    noBtn.style.display = 'none';
    yesBtn.style.display = 'none';
    bear.style.opacity = '0';

    // Hide banner
    document.querySelector('.banner').style.display = 'none';

    // Show celebration
    celebration.classList.remove('hidden');

    // Create floating hearts
    createFloatingHearts();
});

function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'floatUp 3s ease-in forwards';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }, 300);

    // Add CSS for floating hearts
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Position the No button initially
noBtn.style.left = '50px';
noBtn.style.top = '0px';
