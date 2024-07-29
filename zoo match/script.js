document.addEventListener('DOMContentLoaded', () => {
    const easyCards = [
        '🐶', '🐶', '🐱', '🐱', '🐭', '🐭', '🐹', '🐹',
        '🐰', '🐰', '🦊', '🦊', '🐻', '🐻', '🐼', '🐼'
    ];
    const mediumCards = [
        '🐶', '🐶', '🐱', '🐱', '🐭', '🐭', '🐹', '🐹',
        '🐰', '🐰', '🦊', '🦊', '🐻', '🐻', '🐼', '🐼',
        '🐨', '🐨', '🐯', '🐯', '🦁', '🦁', '🐮', '🐮',
        '🐷', '🐷', '🐸', '🐸', '🐵', '🐵', '🐔', '🐔'
    ];
    const hardCards = [
        '🐶', '🐶', '🐱', '🐱', '🐭', '🐭', '🐹', '🐹',
        '🐰', '🐰', '🦊', '🦊', '🐻', '🐻', '🐼', '🐼',
        '🐨', '🐨', '🐯', '🐯', '🦁', '🦁', '🐮', '🐮',
        '🐷', '🐷', '🐸', '🐸', '🐵', '🐵', '🐔', '🐔',
        '🐧', '🐧', '🐦', '🐦', '🐤', '🐤', '🦉', '🦉',
        '🦅', '🦅', '🦆', '🦆', '🦇', '🦇', '🐺', '🐺',
        '🦄', '🦄', '🐴', '🐴', '🐗', '🐗'
    ];

    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart');
    const restartOverButton = document.getElementById('restart-over');
    const startButton = document.getElementById('start-game');
    const startScreen = document.getElementById('start-screen');
    const difficultySelect = document.getElementById('difficulty');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const livesElement = document.getElementById('lives');
    const gameOverElement = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const loadingScreen = document.getElementById('loading-screen');
    const clickSound = document.getElementById('click-sound');
    const backgroundMusic = document.getElementById('background-music');
    const gameOverSound = document.getElementById('game-over-sound');
    const muteButton = document.getElementById('mute-button');
    const unmutePath = document.getElementById('unmute-path');
    const mutePath = document.getElementById('mute-path');
    const congratulationsElement = document.getElementById('congratulations');
    const finalCongratsScoreElement = document.getElementById('final-congrats-score');
    const playAgainButton = document.getElementById('play-again');
    const gameElements = document.querySelectorAll('h1, .info, .controls, #game-board, #restart');
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let timer;
    let time = 0;
    let currentCards = easyCards;
    let gameStarted = false;
    let lives = 4;
    let isMuted = false;

    // Shuffle cards
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Create board
    function createBoard() {
        shuffle(currentCards);
        gameBoard.innerHTML = '';
        const gridSize = Math.sqrt(currentCards.length);
        switch (difficultySelect.value) {
            case '4':
                gameBoard.style.gridTemplateColumns = `repeat(4, 1fr)`;
                break;
            case '6':
                gameBoard.style.gridTemplateColumns = `repeat(5, 1fr)`;
                break;
            case '8':
                gameBoard.style.gridTemplateColumns = `repeat(6, 1fr)`;
                break;
        }
        currentCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.value = card;
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back">${card}</div>
            `;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
        moves = 0;
        time = 0;
        gameStarted = false;
        updateLivesDisplay();
        movesElement.textContent = `Moves: ${moves}`;
        timerElement.textContent = `Time: ${time}s`;
        clearInterval(timer);
        gameOverElement.style.display = 'none';
        congratulationsElement.style.display = 'none'; // Hide the congratulations screen initially
    }

    // Start timer
    function startTimer() {
        timer = setInterval(() => {
            time++;
            timerElement.textContent = `Time: ${time}s`;
        }, 1000);
    }

    // Flip card
    function flipCard() {
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
            if (!isMuted) backgroundMusic.play();
        }

        const card = this;
        if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
            card.classList.add('flipped');
            if (!isMuted) clickSound.play();
            flippedCards.push(card);
            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = `Moves: ${moves}`;
                checkMatch();
            }
        }
    }

    // Check for match
    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            matchedCards.push(card1, card2);
            flippedCards = [];
            if (matchedCards.length === currentCards.length) {
                clearInterval(timer);
                showCongratulationsScreen();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                lives--;
                updateLivesDisplay();
                if (lives === 0) {
                    clearInterval(timer);
                    backgroundMusic.pause();
                    if (!isMuted) gameOverSound.play();
                    showGameOverScreen();
                }
            }, 1000);
        }
    }

    // Show game over screen
    function showGameOverScreen() {
        finalScoreElement.textContent = `Time: ${time}s, Moves: ${moves}`;
        gameOverElement.style.display = 'block';
    }

    // Show congratulations screen
    function showCongratulationsScreen() {
        finalCongratsScoreElement.textContent = `Time: ${time}s, Moves: ${moves}`;
        congratulationsElement.style.display = 'block';
        gameOverElement.style.display = 'none'; // Hide game over screen if it's visible
    }

    // Show loading screen
    function showLoadingScreen() {
        loadingScreen.style.display = 'flex';
    }

    // Hide loading screen
    function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
    }

    // Update lives display
    function updateLivesDisplay() {
        livesElement.textContent = `Lives: ${lives}`;
        if (lives <= 2) {
            livesElement.classList.add('glow-red');
        } else {
            livesElement.classList.remove('glow-red');
        }
    }

    // Restart game
    function restartGame() {
        gameElements.forEach(element => element.classList.add('hidden'));
        showLoadingScreen();
        const difficulty = difficultySelect.value;
        setTimeout(() => {
            switch (difficulty) {
                case '4':
                    currentCards = easyCards;
                    gameBoard.classList.add('easy');
                    gameBoard.classList.remove('medium', 'hard');
                    lives = 4;
                    break;
                case '6':
                    currentCards = mediumCards;
                    gameBoard.classList.add('medium');
                    gameBoard.classList.remove('easy', 'hard');
                    lives = 6;
                    break;
                case '8':
                    currentCards = hardCards;
                    gameBoard.classList.add('hard');
                    gameBoard.classList.remove('easy', 'medium');
                    lives = 8;
                    break;
            }
            createBoard();
            if (!isMuted) backgroundMusic.play();
            hideLoadingScreen();
            setTimeout(() => {
                gameElements.forEach(element => {
                    element.classList.remove('hidden');
                    element.classList.add('fade-in');
                });
                document.querySelectorAll('.card').forEach(card => {
                    card.classList.add('flipped');
                });
                setTimeout(() => {
                    document.querySelectorAll('.card').forEach(card => {
                        card.classList.remove('flipped');
                    });
                }, 3000); // 3 seconds
            }, 1000); // Match the duration of the fade-out animation
        }, 1000); // Simulate loading time
    }

    // Start game
    function startGame() {
        startScreen.classList.add('fade-out');
        setTimeout(() => {
            startScreen.style.display = 'none';
            gameElements.forEach(element => {
                element.classList.remove('hidden');
                element.classList.add('fade-in');
            });
            createBoard();

            // Flip all cards to show them
            document.querySelectorAll('.card').forEach(card => {
                card.classList.add('flipped');
            });

            // After 3 seconds, flip them back
            setTimeout(() => {
                document.querySelectorAll('.card').forEach(card => {
                    card.classList.remove('flipped');
                });
            }, 3000); // 3 seconds
        }, 1000); // Match the duration of the fade-out animation
    }

    // Toggle mute
    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            unmutePath.style.fill = 'red';
            mutePath.style.fill = 'red';
            backgroundMusic.pause();
        } else {
            unmutePath.style.fill = '#ffdd00';
            mutePath.style.fill = '#ffdd00';
            if (gameStarted) backgroundMusic.play();
        }
    }

    muteButton.addEventListener('click', toggleMute);
    restartButton.addEventListener('click', restartGame);
    restartOverButton.addEventListener('click', restartGame);
    startButton.addEventListener('click', startGame);
    difficultySelect.addEventListener('change', restartGame);

    playAgainButton.addEventListener('click', () => {
        congratulationsElement.style.display = 'none';
        restartGame();
    });

    // Show start screen initially and hide game elements
    startScreen.style.display = 'block';
    gameElements.forEach(element => element.classList.add('hidden'));
});
