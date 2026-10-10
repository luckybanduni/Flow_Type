/* =========================================================
   FLOWTYPE — JAVASCRIPT
   ========================================================= */

const gameArea = document.getElementById("gameArea");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("startButton");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const comboElement = document.getElementById("combo");

const gameControls = document.getElementById("gameControls");

const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

const pauseScreen = document.getElementById("pauseScreen");
const resumeButton = document.getElementById("resumeButton");

const resultsScreen = document.getElementById("resultsScreen");
const playAgainButton = document.getElementById("playAgainButton");

const finalScore = document.getElementById("finalScore");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");

const musicToggle = document.getElementById("musicToggle");

const backgroundToggle =
    document.getElementById("backgroundToggle");

const backgroundMenu =
    document.getElementById("backgroundMenu");

const backgroundUpload =
    document.getElementById("backgroundUpload");

const backgroundOptions =
    document.querySelectorAll(".background-option");

const speedOptions =
    document.querySelectorAll(".speed-option");


/* =========================================================
   GAME SETTINGS
   ========================================================= */

const speedSettings = {

    slow: {
        fallSpeed: 35,
        spawnDelay: 1500
    },

    easy: {
        fallSpeed: 50,
        spawnDelay: 1250
    },

    normal: {
        fallSpeed: 70,
        spawnDelay: 1050
    },

    fast: {
        fallSpeed: 95,
        spawnDelay: 850
    },

    "very-fast": {
        fallSpeed: 125,
        spawnDelay: 650
    }

};


/* =========================================================
   GAME VARIABLES
   ========================================================= */

let selectedSpeed = "slow";

let currentFallSpeed =
    speedSettings.slow.fallSpeed;

let spawnDelay =
    speedSettings.slow.spawnDelay;

let gameStarted = false;
let gamePaused = false;

let score = 0;
let combo = 0;
let level = 1;

let correctCharacters = 0;
let totalCharacters = 0;
let totalAttempts = 0;

let startTime = 0;

let animationFrame = null;
let spawnTimer = null;


/* =========================================================
   MULTI-TARGET SYSTEM
   ========================================================= */

const activeTargets = new Set();

let activeTypingTarget = null;

let gameSession = 0;


/* =========================================================
   AUDIO
   ========================================================= */

let music = null;
let musicPlaying = false;


/* =========================================================
   SPEED SELECTION
   ========================================================= */

speedOptions.forEach(button => {

    button.addEventListener("click", () => {

        const speed =
            button.dataset.speed;

        if (!speedSettings[speed]) {
            return;
        }

        selectedSpeed = speed;

        currentFallSpeed =
            speedSettings[speed].fallSpeed;

        spawnDelay =
            speedSettings[speed].spawnDelay;

        speedOptions.forEach(option => {

            option.classList.remove("active");

        });

        button.classList.add("active");

    });

});


/* =========================================================
   MUSIC
   ========================================================= */

function setupMusic() {

    if (!music) {

        music = new Audio("music.mp3");

        music.loop = true;

        music.volume = 0.35;

    }

}


function toggleMusic() {

    setupMusic();

    if (!musicPlaying) {

        music.play()
            .then(() => {

                musicPlaying = true;

                musicToggle.classList.add("active");

                musicToggle.textContent = "🔊";

            })
            .catch(error => {

                console.log(
                    "Music could not start:",
                    error
                );

            });

    } else {

        music.pause();

        musicPlaying = false;

        musicToggle.classList.remove("active");

        musicToggle.textContent = "🎵";

    }

}


musicToggle.addEventListener(
    "click",
    toggleMusic
);


/* =========================================================
   BACKGROUND MENU
   ========================================================= */

function closeBackgroundMenu() {

    if (!backgroundMenu) {
        return;
    }

    backgroundMenu.classList.remove("show");

}


backgroundToggle.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        backgroundMenu.classList.toggle("show");

    }
);


/* =========================================================
   APPLY BACKGROUND
   ========================================================= */

function applyBackground(type) {

    document.body.classList.remove(
        "bg-default",
        "bg-sakura",
        "bg-night",
        "bg-dark",
        "bg-custom"
    );


    if (type === "custom") {

        const customBackground =
            localStorage.getItem(
                "flowtypeCustomBackground"
            );

        if (customBackground) {

            document.body.classList.add(
                "bg-custom"
            );

            document.body.style.backgroundImage =
                `url("${customBackground}")`;

        }

    } else {

        document.body.classList.add(
            `bg-${type}`
        );

        document.body.style.backgroundImage = "";

    }


    backgroundOptions.forEach(option => {

        option.classList.remove("active");

        if (
            option.dataset.background === type
        ) {

            option.classList.add("active");

        }

    });

}


/* =========================================================
   BACKGROUND OPTIONS
   ========================================================= */

backgroundOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            const background =
                option.dataset.background;

            if (!background) {
                return;
            }

            if (background === "custom") {

                if (backgroundUpload) {

                    backgroundUpload.click();

                }

                return;

            }

            applyBackground(background);

            localStorage.setItem(
                "flowtypeBackground",
                background
            );

            closeBackgroundMenu();

        }
    );

});


/* =========================================================
   CUSTOM BACKGROUND UPLOAD
   ========================================================= */

backgroundUpload.addEventListener(
    "change",
    event => {

        const files =
            event.target.files;

        if (
            !files ||
            !files.length
        ) {
            return;
        }

        const file = files[0];

        if (
            !file.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            return;

        }

        const reader =
            new FileReader();

        reader.onload = function(e) {

            const imageData =
                e.target.result;

            try {

                localStorage.setItem(
                    "flowtypeCustomBackground",
                    imageData
                );

            } catch (error) {

                console.error(error);

                alert(
                    "This image is too large to save in the browser. Please choose a smaller image."
                );

                return;

            }

            document.body.classList.remove(
                "bg-default",
                "bg-sakura",
                "bg-night",
                "bg-dark"
            );

            document.body.classList.add(
                "bg-custom"
            );

            document.body.style.backgroundImage =
                `url("${imageData}")`;

            localStorage.setItem(
                "flowtypeBackground",
                "custom"
            );

            backgroundOptions.forEach(option => {

                option.classList.remove("active");

            });

            const customOption =
                document.querySelector(
                    '[data-background="custom"]'
                );

            if (customOption) {

                customOption.classList.add("active");

            }

            closeBackgroundMenu();

        };

        reader.readAsDataURL(file);

    }
);


/* =========================================================
   LOAD SAVED BACKGROUND
   ========================================================= */

function loadSavedBackground() {

    const savedBackground =
        localStorage.getItem(
            "flowtypeBackground"
        );

    if (savedBackground) {

        applyBackground(
            savedBackground
        );

    } else {

        applyBackground(
            "default"
        );

    }

}


loadSavedBackground();


/* =========================================================
   CLOSE BACKGROUND MENU OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !backgroundMenu.contains(event.target) &&
            event.target !== backgroundToggle
        ) {

            closeBackgroundMenu();

        }

    }
);


/* =========================================================
   WORD / LETTER BANK
   ========================================================= */

const letters =
    "abcdefghijklmnopqrstuvwxyz";

const words = [

    "apple",
    "orange",
    "banana",
    "grape",
    "water",
    "cloud",
    "river",
    "ocean",
    "mountain",
    "forest",
    "flower",
    "garden",
    "summer",
    "winter",
    "spring",
    "autumn",
    "morning",
    "evening",
    "night",
    "light",
    "shadow",
    "dream",
    "world",
    "space",
    "planet",
    "star",
    "moon",
    "sun",
    "earth",
    "sky",

    "code",
    "coding",
    "program",
    "programmer",
    "developer",
    "computer",
    "keyboard",
    "mouse",
    "screen",
    "website",
    "internet",
    "browser",
    "server",
    "database",
    "software",
    "hardware",
    "digital",
    "technology",
    "system",
    "network",
    "javascript",
    "python",
    "html",
    "style",
    "function",
    "variable",
    "object",
    "array",
    "string",
    "button",
    "project",
    "editor",
    "github",
    "online",
    "mobile",

    "game",
    "gaming",
    "player",
    "level",
    "score",
    "power",
    "battle",
    "enemy",
    "mission",
    "quest",
    "hero",
    "action",
    "speed",
    "race",
    "drive",
    "truck",
    "car",
    "fighter",
    "boss",
    "victory",
    "challenge",
    "adventure",
    "arcade",

    "book",
    "school",
    "college",
    "student",
    "teacher",
    "learning",
    "lesson",
    "chapter",
    "science",
    "math",
    "history",
    "language",
    "knowledge",
    "answer",
    "question",
    "practice",
    "future",
    "career",
    "skill",
    "success",

    "music",
    "guitar",
    "piano",
    "song",
    "sound",
    "rhythm",
    "melody",
    "artist",
    "creative",
    "design",
    "drawing",
    "picture",
    "camera",
    "movie",
    "anime",
    "story",
    "character",
    "studio",
    "video",
    "creator",

    "coffee",
    "tea",
    "bread",
    "cake",
    "pizza",
    "burger",
    "cookie",
    "kitchen",
    "house",
    "window",
    "door",
    "table",
    "chair",
    "phone",
    "clock",
    "morning",
    "family",
    "friend",
    "travel",
    "journey",

    "happy",
    "smile",
    "peace",
    "calm",
    "strong",
    "brave",
    "focus",
    "energy",
    "positive",
    "freedom",
    "hope",
    "dream",
    "goal",
    "progress",
    "winner",
    "amazing",
    "awesome",
    "perfect",
    "bright",
    "future",

    "animal",
    "puppy",
    "kitten",
    "tiger",
    "lion",
    "horse",
    "rabbit",
    "panda",
    "monkey",
    "elephant",
    "forest",
    "rain",
    "thunder",
    "weather",
    "sunshine",
    "rainbow",
    "nature",
    "garden",
    "tree",
    "leaf",

    "keyboard",
    "typing",
    "target",
    "letter",
    "word",
    "player",
    "correct",
    "wrong",
    "combo",
    "accuracy",
    "speed",
    "practice",
    "flow",
    "focus",
    "reaction",
    "challenge",
    "master",
    "fast",
    "quick",
    "skill",

    "beautiful",
    "important",
    "different",
    "creative",
    "computer",
    "technology",
    "experience",
    "development",
    "programming",
    "application",
    "information",
    "communication",
    "education",
    "motivation",
    "imagination",
    "adventure",
    "friendship",
    "knowledge",
    "opportunity",
    "achievement"

];


const MAX_VISIBLE_TARGETS = 7;

const INITIAL_TARGETS = 4;

let lastWord = "";


/* =========================================================
   RANDOM HELPERS
   ========================================================= */

function randomNumber(
    min,
    max
) {

    return Math.random() *
        (max - min) +
        min;

}


function getRandomWord() {

    let word;

    do {

        word =
            words[
                Math.floor(
                    Math.random() *
                    words.length
                )
            ];

    } while (
        words.length > 1 &&
        word === lastWord
    );

    lastWord = word;

    return word;

}


function getRandomLetter() {

    return letters[
        Math.floor(
            Math.random() *
            letters.length
        )
    ];

}


function getTargetWidth(
    isWord,
    text
) {

    if (isWord) {

        return Math.max(
            90,
            text.length * 30
        );

    }

    return 55;

}


/* =========================================================
   CREATE TARGET
   ========================================================= */

function createTarget(
    startY = -60
) {

    if (
        !gameStarted ||
        gamePaused
    ) {
        return null;
    }

    if (
        activeTargets.size >=
        MAX_VISIBLE_TARGETS
    ) {
        return null;
    }


    const isWord =
        Math.random() < 0.40;

    const text =
        isWord
            ? getRandomWord()
            : getRandomLetter();


    const element =
        document.createElement("div");

    element.classList.add(
        "game-item"
    );


    if (isWord) {

        element.classList.add(
            "word"
        );


        [...text].forEach(
            character => {

                const span =
                    document.createElement(
                        "span"
                    );

                span.classList.add(
                    "target-letter"
                );

                span.textContent =
                    character;

                element.appendChild(
                    span
                );

            }
        );

    } else {

        element.textContent =
            text;

    }


    element.dataset.targetText =
        text.toLowerCase();

    element.dataset.typedText =
        "";


    const targetWidth =
        getTargetWidth(
            isWord,
            text
        );


    element.style.width =
        `${targetWidth}px`;


    const areaWidth =
        gameArea.clientWidth;

    const maxLeft =
        Math.max(
            10,
            areaWidth -
            targetWidth -
            10
        );


    element.style.left =
        `${randomNumber(
            10,
            maxLeft
        )}px`;


    element.style.top =
        `${startY}px`;


    gameArea.appendChild(
        element
    );


    activeTargets.add(
        element
    );


    animateTarget(
        element,
        gameSession
    );


    return element;

}


/* =========================================================
   INITIAL TARGETS
   ========================================================= */

function createInitialTargets() {

    const positions = [
        -70,
        -170,
        -270,
        -370
    ];


    positions.forEach(
        (position, index) => {

            setTimeout(
                () => {

                    if (
                        gameStarted &&
                        !gamePaused
                    ) {

                        createTarget(
                            position
                        );

                    }

                },
                index * 180
            );

        }
    );

}


/* =========================================================
   TARGET SPAWNER
   ========================================================= */

function scheduleNextTarget(
    delay = spawnDelay
) {

    clearTimeout(
        spawnTimer
    );


    if (
        !gameStarted ||
        gamePaused
    ) {
        return;
    }


    spawnTimer =
        setTimeout(
            () => {

                if (
                    !gameStarted ||
                    gamePaused
                ) {
                    return;
                }


                if (
                    activeTargets.size <
                    MAX_VISIBLE_TARGETS
                ) {

                    createTarget();

                }


                scheduleNextTarget(
                    spawnDelay
                );

            },
            delay
        );

}


/* =========================================================
   TARGET ANIMATION
   ========================================================= */

function animateTarget(
    element,
    sessionId
) {

    let position =
        parseFloat(
            element.style.top
        ) || -60;


    let lastTime =
        performance.now();


    function move(time) {

        if (
            !gameStarted ||
            sessionId !== gameSession ||
            !activeTargets.has(element)
        ) {

            return;

        }


        if (gamePaused) {

            lastTime = time;

            requestAnimationFrame(
                move
            );

            return;

        }


        const delta =
            (time - lastTime) /
            1000;

        lastTime = time;


        position +=
            currentFallSpeed *
            delta;


        element.style.top =
            `${position}px`;


        if (
            position >
            gameArea.clientHeight + 50
        ) {

            targetMissed(
                element
            );

            return;

        }


        requestAnimationFrame(
            move
        );

    }


    requestAnimationFrame(
        move
    );

}


/* =========================================================
   MISSED TARGET
   ========================================================= */

function targetMissed(
    element
) {

    if (
        !element ||
        !activeTargets.has(element)
    ) {
        return;
    }


    activeTargets.delete(
        element
    );


    if (
        activeTypingTarget ===
        element
    ) {

        activeTypingTarget =
            null;

    }


    if (
        element.parentNode
    ) {

        element.remove();

    }


    combo = 0;

    updateStats();

}

function startGame() {
    gameStarted = true;
    gamePaused = false;
    gameSession++;

    score = 0;
    combo = 0;
    level = 1;
    correctCharacters = 0;
    totalCharacters = 0;
    totalAttempts = 0;

    activeTypingTarget = null;

    clearTimeout(spawnTimer);
    removeAllTargets();

    currentFallSpeed = speedSettings[selectedSpeed].fallSpeed;
    spawnDelay = speedSettings[selectedSpeed].spawnDelay;

    updateStats();
    updateLevel();

    // Hide the welcome screen.
    welcome.classList.add("hidden");

    // Hide the results and pause screens.
    resultsScreen.classList.remove("show");
    pauseScreen.classList.remove("show");

    // Show the game controls.
    gameControls.classList.add("visible");

    // Reset the pause button.
    pauseButton.textContent = "⏸ Pause";

    // Create falling targets and start spawning.
    createInitialTargets();
    scheduleNextTarget(spawnDelay);
}

function pauseGame() {
    if (!gameStarted) return;

    gamePaused = !gamePaused;

    if (gamePaused) {
        pauseButton.textContent = "▶ Continue";
        pauseScreen.classList.add("show");

        if (music && musicPlaying) {
            music.pause();
        }
    } else {
        pauseButton.textContent = "⏸ Pause";
        pauseScreen.classList.remove("show");

        if (music && musicPlaying) {
            music.play().catch(() => {});
        }
    }
}

function restartGame() {
    clearTimeout(spawnTimer);

    gameSession++;

    removeAllTargets();

    gameStarted = false;
    gamePaused = false;
    gameOver = false;

    activeTypingTarget = null;

    score = 0;
    combo = 0;
    correctCharacters = 0;
    totalCharacters = 0;
    missedTargets = 0;

    updateStats();
    updateLevel();

    pauseOverlay.classList.add("hidden");
    resultsScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    startGame();
}


function endGame() {
    gameStarted = false;
    gamePaused = false;
    gameOver = true;

    gameSession++;

    clearTimeout(spawnTimer);

    activeTypingTarget = null;

    if (musicEnabled) {
        music.pause();
    }

    finalScore.textContent = score;
    finalAccuracy.textContent = getAccuracy() + "%";
    finalCombo.textContent = combo;

    gameScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    pauseOverlay.classList.add("hidden");
}


function getAccuracy() {
    if (totalCharacters <= 0) {
        return 100;
    }

    return Math.round((correctCharacters / totalCharacters) * 100);
}


function updateStats() {
    if (scoreElement) {
        scoreElement.textContent = score;
    }

    if (comboElement) {
        comboElement.textContent = combo;
    }

    if (accuracyElement) {
        accuracyElement.textContent = getAccuracy() + "%";
    }

    if (missedElement) {
        missedElement.textContent = missedTargets;
    }
}


function updateLevel() {
    const newLevel = Math.floor(score / 100) + 1;

    if (newLevel !== level) {
        level = newLevel;

        if (levelElement) {
            levelElement.textContent = level;
        }

        currentFallSpeed = baseFallSpeed + ((level - 1) * speedIncrease);
    } else {
        if (levelElement) {
            levelElement.textContent = level;
        }
    }
}


function showCorrectEffect(target) {
    if (!target) return;

    target.classList.remove("wrong");
    target.classList.add("correct");

    setTimeout(() => {
        if (target && target.isConnected) {
            target.classList.remove("correct");
        }
    }, 250);
}


function showWrongEffect(target) {
    if (!target) return;

    target.classList.remove("correct");
    target.classList.add("shake", "wrong");

    playTypingSound(false);

    if (navigator.vibrate) {
        navigator.vibrate([35, 25, 35]);
    }

    setTimeout(() => {
        if (target && target.isConnected) {
            target.classList.remove("shake", "wrong");
        }
    }, 350);
}


function createCompletionBurst(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    const centerX =
        rect.left - gameRect.left + rect.width / 2;

    const centerY =
        rect.top - gameRect.top + rect.height / 2;

    const burst = document.createElement("div");
    burst.className = "completion-burst";

    burst.style.left = `${centerX}px`;
    burst.style.top = `${centerY}px`;

    const isWord = element.classList.contains("word");
    const particleCount = isWord ? 28 : 14;

    const ring = document.createElement("div");
    ring.className = "completion-ring";
    burst.appendChild(ring);

    const flash = document.createElement("div");
    flash.className = "completion-flash";
    burst.appendChild(flash);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");
        particle.className = "completion-particle";

        const angle =
            (Math.PI * 2 * i) / particleCount;

        const distance =
            45 + Math.random() * 65;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;

        particle.style.setProperty(
            "--particle-x",
            `${x}px`
        );

        particle.style.setProperty(
            "--particle-y",
            `${y}px`
        );

        burst.appendChild(particle);
    }

    gameArea.appendChild(burst);

    setTimeout(() => {
        burst.remove();
    }, 700);
}


function createSparkles(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    const centerX =
        rect.left - gameRect.left + rect.width / 2;

    const centerY =
        rect.top - gameRect.top + rect.height / 2;

    const sparkleContainer = document.createElement("div");
    sparkleContainer.className = "typing-sparkles";

    sparkleContainer.style.left = `${centerX}px`;
    sparkleContainer.style.top = `${centerY}px`;

    for (let i = 0; i < 4; i++) {
        const sparkle = document.createElement("span");

        sparkle.className = "typing-sparkle";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            10 + Math.random() * 20;

        sparkle.style.setProperty(
            "--sparkle-x",
            `${Math.cos(angle) * distance}px`
        );

        sparkle.style.setProperty(
            "--sparkle-y",
            `${Math.sin(angle) * distance}px`
        );

        sparkleContainer.appendChild(sparkle);
    }

    gameArea.appendChild(sparkleContainer);

    setTimeout(() => {
        sparkleContainer.remove();
    }, 500);
}


function playTypingSound(correct) {
    if (!soundEnabled) return;

    try {
        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) return;

        const context = new AudioContext();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.type = "sine";

        oscillator.frequency.value =
            correct ? 620 : 170;

        gain.gain.setValueAtTime(
            0.0001,
            context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.045,
            context.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + 0.08
        );

        oscillator.start();

        oscillator.stop(
            context.currentTime + 0.09
        );

        setTimeout(() => {
            context.close().catch(() => {});
        }, 150);
    } catch (error) {
        // Audio is optional, so ignore browser audio errors.
    }
}


function findMatchingTarget(key) {
    const matches = [];

    activeTargets.forEach(target => {
        if (!target || !target.isConnected) {
            return;
        }

        const text =
            (target.dataset.targetText || "").toLowerCase();

        const typed =
            (target.dataset.typedText || "").toLowerCase();

        if (!text) {
            return;
        }

        if (target.classList.contains("word")) {
            if (typed.length > 0) {
                return;
            }
        }

        if (text.startsWith(key)) {
            const top =
                parseFloat(target.style.top) || 0;

            matches.push({
                target,
                top
            });
        }
    });

    if (matches.length === 0) {
        return null;
    }

    matches.sort((a, b) => a.top - b.top);

    return matches[matches.length - 1].target;
}


function handleLetterInput(key, target) {
    if (!target || !activeTargets.has(target)) {
        return;
    }

    const expected =
        (target.dataset.targetText || "").toLowerCase();

    totalCharacters++;

    if (key === expected) {
        correctCharacters++;
        score += 10;
        combo++;

        showCorrectEffect(target);
        createCompletionBurst(target);
        playTypingSound(true);

        removeTarget(target);

        updateStats();
        updateLevel();

        return;
    }

    combo = 0;

    showWrongEffect(target);

    updateStats();
}


function handleWordInput(key, target) {
    if (!target || !activeTargets.has(target)) {
        return;
    }

    const word =
        (target.dataset.targetText || "").toLowerCase();

    let typed =
        (target.dataset.typedText || "").toLowerCase();

    const expected =
        word.charAt(typed.length);

    totalCharacters++;

    if (key === expected) {
        typed += key;

        target.dataset.typedText = typed;

        correctCharacters++;
        combo++;

        const letterIndex = typed.length - 1;

        const letterSpans =
            target.querySelectorAll(".target-letter");

        if (letterSpans[letterIndex]) {
            letterSpans[letterIndex].classList.add("typed");
        }

        createSparkles(target);
        showCorrectEffect(target);
        playTypingSound(true);

        if (typed.length >= word.length) {
            score += word.length * 10;

            createCompletionBurst(target);

            removeTarget(target);

            activeTypingTarget = null;

            updateStats();
            updateLevel();

            return;
        }

        updateStats();
        return;
    }

    combo = 0;

    showWrongEffect(target);

    updateStats();
}


function removeTarget(target) {
    if (!target) return;

    activeTargets.delete(target);

    if (activeTypingTarget === target) {
        activeTypingTarget = null;
    }

    if (target.isConnected) {
        target.remove();
    }
}


function removeAllTargets() {
    activeTargets.forEach(target => {
        if (target && target.isConnected) {
            target.remove();
        }
    });

    activeTargets.clear();

    activeTypingTarget = null;

    const remaining =
        gameArea.querySelectorAll(".game-item");

    remaining.forEach(element => {
        element.remove();
    });
}


document.addEventListener("keydown", event => {
    if (!gameStarted || gamePaused) {
        return;
    }

    if (event.key === "Escape") {
        pauseGame();
        return;
    }

    const key = event.key.toLowerCase();

    if (
        key.length !== 1 ||
        !/[a-z]/.test(key)
    ) {
        return;
    }

    /*
     * If the player is already typing a word,
     * keep that word selected until it is finished.
     */
    if (activeTypingTarget) {
        if (!activeTargets.has(activeTypingTarget)) {
            activeTypingTarget = null;
        } else {
            if (
                activeTypingTarget.classList.contains("word")
            ) {
                handleWordInput(
                    key,
                    activeTypingTarget
                );
            } else {
                handleLetterInput(
                    key,
                    activeTypingTarget
                );
            }

            return;
        }
    }

    /*
     * No target is currently selected.
     * Find the closest/lower visible target
     * beginning with the pressed key.
     */
    const target = findMatchingTarget(key);

    if (!target) {
        return;
    }

    activeTypingTarget = target;

    if (target.classList.contains("word")) {
        handleWordInput(key, target);
    } else {
        handleLetterInput(key, target);
    }
});


if (startButton) {
    startButton.addEventListener(
        "click",
        startGame
    );
}


if (pauseButton) {
    pauseButton.addEventListener(
        "click",
        pauseGame
    );
}


if (restartButton) {
    restartButton.addEventListener(
        "click",
        restartGame
    );
}


if (playAgainButton) {
    playAgainButton.addEventListener(
        "click",
        restartGame
    );
}


document.addEventListener("visibilitychange", () => {
    if (
        document.hidden &&
        gameStarted &&
        !gamePaused
    ) {
        pauseGame();
    }
});


window.addEventListener("blur", () => {
    if (
        gameStarted &&
        !gamePaused
    ) {
        pauseGame();
    }
});


updateStats();
updateLevel();
