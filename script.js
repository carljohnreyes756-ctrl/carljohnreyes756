const emojiPool = ['🎨','🌈','🍬','✨','🌸','🐳','🌙','🍃','🍕','🚀','🎮','🔥','🐱','🐶','🍓','🍋'];
let flippedCards = [];
let moves = 0;
let timeLeft = 0;
let timerInterval;
let matchedPairs = 0;
let isLocked = false;

// Levels Configuration
const levels = {
    easy: { pairs: 6, time: 45, gridClass: 'grid-easy' },
    medium: { pairs: 8, time: 60, gridClass: 'grid-medium' },
    hard: { pairs: 12, time: 90, gridClass: 'grid-hard' }
};

function startGame(difficulty) {
    const config = levels[difficulty];
    document.getElementById('level-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    timeLeft = config.time;
    document.getElementById('timer').innerText = timeLeft;
    
    setupBoard(config);
    startTimer();
}

function setupBoard(config) {
    const board = document.getElementById('game-board');
    board.className = `game-board ${config.gridClass}`;
    board.innerHTML = '';
    
    // Select and shuffle emojis
    let selectedEmojis = emojiPool.slice(0, config.pairs);
    let gameSet = [...selectedEmojis, ...selectedEmojis].sort(() => Math.random() - 0.5);
    
    gameSet.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${emoji}</div>
        `;
        card.onclick = () => flipCard(card, config.pairs);
        board.appendChild(card);
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) endGame(false);
    }, 1000);
}

function flipCard(card, totalPairs) {
    if (isLocked || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').innerText = moves;
        checkMatch(totalPairs);
    }
}

function checkMatch(totalPairs) {
    isLocked = true;
    const [c1, c2] = flippedCards;
    const emoji1 = c1.querySelector('.card-front').innerText;
    const emoji2 = c2.querySelector('.card-front').innerText;

    if (emoji1 === emoji2) {
        matchedPairs++;
        flippedCards = [];
        isLocked = false;
        if (matchedPairs === totalPairs) endGame(true);
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

function endGame(isWin) {
    clearInterval(timerInterval);
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const msg = document.getElementById('modal-msg');
    
    modal.classList.remove('hidden');
    if (isWin) {
        title.innerText = "✨ Victory! ✨";
        msg.innerHTML = `You matched all pairs!<br>Moves: <b>${moves}</b> | Time Left: <b>${timeLeft}s</b>`;
    } else {
        title.innerText = "⏰ Time's Up! ⏰";
        msg.innerText = "Don't give up! Try again to beat the clock.";
    }
}

// Quit Game Button
document.getElementById('quit-btn').onclick = () => location.reload();