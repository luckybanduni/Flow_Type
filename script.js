/* =========================================================
   FLOWTYPE — JAVASCRIPT
   ========================================================= */


/* =========================================================
   ELEMENTS
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

// All targets currently visible on the screen.
const activeTargets = new Set();

// The word/letter the player is currently typing.
let activeTypingTarget = null;

// Prevent old animation loops from affecting a restarted game.
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
   BACKGROUND SYSTEM
   ========================================================= */

function closeBackgroundMenu() {

    backgroundMenu.classList.remove("open");

}


backgroundToggle.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        backgroundMenu.classList.toggle("open");

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


    if (type === "default") {

        document.body.classList.add(
            "bg-default"
        );

        document.body.style.backgroundImage = "";

    }


    else if (type === "sakura") {

        document.body.classList.add(
            "bg-sakura"
        );

        document.body.style.backgroundImage = "";

    }


    else if (type === "night") {

        document.body.classList.add(
            "bg-night"
        );

        document.body.style.backgroundImage = "";

    }


    else if (type === "dark") {

        document.body.classList.add(
            "bg-dark"
        );

        document.body.style.backgroundImage = "";

    }


    else if (type === "custom") {

        const savedImage =
            localStorage.getItem(
                "flowtypeCustomBackground"
            );


        if (savedImage) {

            document.body.classList.add(
                "bg-custom"
            );

            document.body.style.backgroundImage =
                `url("${savedImage}")`;

        } else {

            alert(
                "No custom background found. Please upload an image first."
            );

            return;

        }

    }


    localStorage.setItem(
        "flowtypeBackground",
        type
    );


    backgroundOptions.forEach(option => {

        option.classList.remove("active");

    });


    const activeOption =
        document.querySelector(
            `.background-option[data-background="${type}"]`
        );


    if (activeOption) {
        activeOption.classList.add("active");
    }

}


/* =========================================================
   BACKGROUND OPTION BUTTONS
   ========================================================= */

backgroundOptions.forEach(option => {

    option.addEventListener("click", () => {

        const background =
            option.dataset.background;

        applyBackground(background);

        closeBackgroundMenu();

    });

});


/* =========================================================
   UPLOAD BACKGROUND
   ========================================================= */

backgroundUpload.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

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

                option.classList.remove(
                    "active"
                );

            });


            const customOption =
                document.querySelector(
                    '[data-background="custom"]'
                );


            if (customOption) {
                customOption.classList.add(
                    "active"
                );
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
   CLOSE BACKGROUND MENU WHEN CLICKING OUTSIDE
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
   RANDOM TARGET CONTENT
   ========================================================= */

const letters = "abcdefghijklmnopqrstuvwxyz";

const words = [
    "apple", "orange", "banana", "grape", "water", "cloud",
    "river", "ocean", "mountain", "forest", "flower", "garden",
    "summer", "winter", "spring", "autumn", "morning", "evening",
    "night", "light", "shadow", "dream", "world", "space",
    "planet", "star", "moon", "sun", "earth", "sky",

    "code", "coding", "program", "programmer", "developer",
    "computer", "keyboard", "mouse", "screen", "website",
    "internet", "browser", "server", "database", "software",
    "hardware", "digital", "technology", "system", "network",
    "javascript", "python", "html", "style", "function",
    "variable", "object", "array", "string", "button",
    "project", "editor", "github", "online", "mobile",

    "game", "gaming", "player", "level", "score", "power",
    "battle", "enemy", "mission", "quest", "hero", "action",
    "speed", "race", "drive", "truck", "car", "fighter",
    "boss", "victory", "challenge", "adventure", "arcade",
    "console", "controller", "skill", "winner", "start",
    "finish", "jump", "run",

    "learn", "study", "practice", "knowledge", "school",
    "student", "teacher", "book", "lesson", "answer",
    "question", "problem", "solution", "idea", "brain",
    "memory", "focus", "attention", "smart", "language",
    "science", "math", "history", "future",

    "create", "creative", "design", "artist", "picture",
    "music", "video", "movie", "story", "writer", "drawing",
    "color", "beautiful", "imagine", "inspire", "talent",
    "vision", "camera", "animation", "character", "anime",
    "graphic",

    "house", "home", "door", "window", "table", "chair",
    "phone", "clock", "watch", "money", "friend", "family",
    "people", "person", "child", "office", "market", "shop",
    "street", "city", "country", "travel", "train", "plane",
    "road", "place", "food", "coffee", "breakfast", "lunch",
    "dinner",

    "tree", "grass", "leaf", "rain", "snow", "wind", "storm",
    "thunder", "fire", "lake", "sea", "beach", "island",
    "desert", "animal", "bird", "dog", "cat", "horse",
    "tiger", "lion", "wolf", "fish", "butterfly",

    "strong", "brave", "happy", "peace", "success", "progress",
    "effort", "energy", "goal", "better", "great", "amazing",
    "awesome", "perfect", "believe", "achieve", "grow",
    "change", "forward", "freedom", "hope", "smile", "enjoy",
    "confidence",

    "typing", "type", "quick", "fast", "slow", "correct",
    "wrong", "target", "point", "accuracy", "reaction",
    "control", "movement", "pattern", "random", "master",
    "combo",

    "adventure", "computer", "javascript", "technology",
    "programming", "experience", "important", "different",
    "something", "everything", "knowledge", "imagination",
    "creativity", "motivation", "communication", "information",
    "application", "development", "performance", "environment",
    "background", "community", "education", "interesting",
    "successful"
];

let lastWord = "";

const MAX_VISIBLE_TARGETS = 7;
const INITIAL_TARGETS = 4;


/* =========================================================
   RANDOM NUMBER
   ========================================================= */

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}


/* =========================================================
   GET RANDOM WORD
   ========================================================= */

function getRandomWord() {

    let newWord;

    do {
        newWord =
            words[
                Math.floor(
                    Math.random() * words.length
                )
            ];

    } while (
        words.length > 1 &&
        newWord === lastWord
    );

    lastWord = newWord;

    return newWord;
}


/* =========================================================
   TARGET WIDTH
   ========================================================= */

function getTargetWidth(isWord, text) {

    if (!isWord) {
        return 55;
    }

    return Math.max(
        80,
        Math.min(
            190,
            text.length * 18 + 28
        )
    );
}


/* =========================================================
   CREATE TARGET
   ========================================================= */

function createTarget(startY = -60) {

    if (!gameStarted || gamePaused) {
        return null;
    }

    if (
        activeTargets.size >=
        MAX_VISIBLE_TARGETS
    ) {
        return null;
    }

    const element =
        document.createElement("div");

    const isWord =
        Math.random() < 0.4;

    const text =
        isWord
            ? getRandomWord()
            : letters[
                Math.floor(
                    Math.random() *
                    letters.length
                )
            ];

    element.classList.add(
        "game-item"
    );

    if (isWord) {
        element.classList.add("word");
    }

    element.dataset.targetText =
        text;

    element.dataset.typedText =
        "";


    if (isWord) {

        [...text].forEach(
            (char, index) => {

                const letter =
                    document.createElement(
                        "span"
                    );

                letter.className =
                    "target-letter";

                letter.textContent =
                    char;

                letter.dataset.index =
                    index;

                element.appendChild(
                    letter
                );
            }
        );

    } else {

        element.textContent =
            text;

    }


    /* -----------------------------------------
       POSITION
    ----------------------------------------- */

    const areaWidth =
        gameArea.clientWidth;

    const itemWidth =
        getTargetWidth(
            isWord,
            text
        );

    const randomX =
        randomNumber(
            20,
            Math.max(
                21,
                areaWidth -
                itemWidth -
                20
            )
        );

    element.style.left =
        `${randomX}px`;

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
   SPAWN TARGETS
   ========================================================= */

function scheduleNextTarget(
    delay = spawnDelay
) {

    clearTimeout(
        spawnTimer
    );

    spawnTimer =
        setTimeout(
            () => {

                if (
                    gameStarted &&
                    !gamePaused &&
                    activeTargets.size <
                    MAX_VISIBLE_TARGETS
                ) {

                    createTarget();

                }

                if (gameStarted) {
                    scheduleNextTarget();
                }

            },
            delay
        );
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
        (y, index) => {

            setTimeout(
                () => {

                    if (
                        gameStarted &&
                        !gamePaused
                    ) {

                        createTarget(y);

                    }

                },
                index * 180
            );

        }
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
        );

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
            (time - lastTime) / 1000;

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
   TARGET MISSED
   ========================================================= */

function targetMissed(element) {

    if (!element) {
        return;
    }

    activeTargets.delete(
        element
    );

    if (
        activeTypingTarget === element
    ) {

        activeTypingTarget = null;

    }

    if (element.parentNode) {
        element.remove();
    }

    combo = 0;

    updateStats();
}/* =========================================================
   TARGET ANIMATION
   ========================================================= */

function animateTarget(element) {

    let position =
        parseFloat(
            element.style.top
        );


    let lastTime =
        performance.now();


    function move(time) {

        if (!gameStarted) {
            return;
        }


        if (gamePaused) {

            lastTime = time;

            requestAnimationFrame(move);

            return;

        }


        const delta =
            (time - lastTime) / 1000;


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
   TARGET MISSED
   ========================================================= */

function targetMissed(element) {

    if (
        element &&
        element.parentNode
    ) {

        element.remove();

    }


    if (
        currentTarget === element
    ) {

        currentTarget = null;

    }


    combo = 0;

    updateStats();


    scheduleNextTarget();

}


/* =========================================================
   NEXT TARGET
   ========================================================= */

function scheduleNextTarget() {

    clearTimeout(
        spawnTimer
    );


    spawnTimer =
        setTimeout(
            () => {

                if (
                    gameStarted &&
                    !gamePaused
                ) {

                    createTarget();

                }

            },
            spawnDelay
        );

}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    stopGameAnimation();


    gameStarted = true;

    gamePaused = false;


    score = 0;

    combo = 0;

    level = 1;

    correctCharacters = 0;

    totalCharacters = 0;

    totalAttempts = 0;


    startTime =
        Date.now();


    typedText = "";


    currentTarget = null;


    /* REMOVE OLD TARGETS */

    document
        .querySelectorAll(".game-item")
        .forEach(item => item.remove());


    welcome.style.display =
        "none";


    resultsScreen.classList.remove(
        "show"
    );


    pauseScreen.classList.remove(
        "show"
    );


    gameControls.classList.add(
        "visible"
    );


    updateStats();


    createTarget();

}


/* =========================================================
   STOP ANIMATION
   ========================================================= */

function stopGameAnimation() {

    cancelAnimationFrame(
        animationFrame
    );

    clearTimeout(
        spawnTimer
    );

}


/* =========================================================
   RESTART GAME
   ========================================================= */

function restartGame() {

    startGame();

}


/* =========================================================
   PAUSE GAME
   ========================================================= */

function pauseGame() {

    if (
        !gameStarted ||
        gamePaused
    ) {
        return;
    }


    gamePaused = true;


    pauseScreen.classList.add(
        "show"
    );

}


/* =========================================================
   RESUME GAME
   ========================================================= */

function resumeGame() {

    if (
        !gameStarted ||
        !gamePaused
    ) {
        return;
    }


    gamePaused = false;


    pauseScreen.classList.remove(
        "show"
    );

}


/* =========================================================
   END GAME
   ========================================================= */

function endGame() {

    gameStarted = false;

    gamePaused = false;


    stopGameAnimation();


    document
        .querySelectorAll(".game-item")
        .forEach(item => item.remove());


    currentTarget = null;


    gameControls.classList.remove(
        "visible"
    );


    pauseScreen.classList.remove(
        "show"
    );


    finalScore.textContent =
        score;


    finalWpm.textContent =
        calculateWPM();


    finalAccuracy.textContent =
        calculateAccuracy() + "%";


    resultsScreen.classList.add(
        "show"
    );

}
/* =========================================================
   KEYBOARD INPUT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !gameStarted ||
            gamePaused
        ) {
            return;
        }


        if (
            event.key === "Escape"
        ) {

            pauseGame();

            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            key.length !== 1 ||
            !/[a-z]/.test(key)
        ) {
            return;
        }


        /* -----------------------------------------
           CONTINUE CURRENT WORD
        ----------------------------------------- */

        if (activeTypingTarget) {

            if (
                !activeTargets.has(
                    activeTypingTarget
                )
            ) {

                activeTypingTarget =
                    null;

            } else {

                if (
                    activeTypingTarget
                        .classList
                        .contains("word")
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


        /* -----------------------------------------
           FIND NEW TARGET
        ----------------------------------------- */

        const target =
            findMatchingTarget(key);


        if (!target) {
            return;
        }


        activeTypingTarget =
            target;


        if (
            target.classList.contains(
                "word"
            )
        ) {

            handleWordInput(
                key,
                target
            );

        } else {

            handleLetterInput(
                key,
                target
            );

        }

    }
);


/* =========================================================
   FIND MATCHING TARGET
   ========================================================= */

function findMatchingTarget(key) {

    const matches = [];


    activeTargets.forEach(
        target => {

            if (
                !target ||
                !target.isConnected
            ) {
                return;
            }


            const text =
                target.dataset
                    .targetText
                    .toLowerCase();


            const typed =
                target.dataset
                    .typedText || "";


            if (typed.length > 0) {
                return;
            }


            if (
                text.startsWith(key)
            ) {

                matches.push(
                    target
                );

            }

        }
    );


    if (
        matches.length === 0
    ) {
        return null;
    }


    /*
       If several targets start with
       the same letter, choose the
       lowest target first.
    */

    matches.sort(
        (a, b) =>
            parseFloat(
                a.style.top
            ) -
            parseFloat(
                b.style.top
            )
    );


    return matches[
        matches.length - 1
    ];
}


/* =========================================================
   LETTER INPUT
   ========================================================= */

function handleLetterInput(
    key,
    target
) {

    if (
        !target ||
        !activeTargets.has(target)
    ) {
        return;
    }


    const targetValue =
        target.dataset.targetText;


    totalAttempts++;
    totalCharacters++;


    if (
        key === targetValue
    ) {

        correctCharacters++;

        score++;

        combo++;


        showCorrectEffect(
            target
        );


        createCompletionBurst(
            target
        );


        removeTarget(
            target
        );


        activeTypingTarget =
            null;


        updateLevel();
        updateStats();

    } else {

        combo = 0;

        showWrongEffect(
            target
        );

        updateStats();

    }
}


/* =========================================================
   WORD INPUT
   ========================================================= */

function handleWordInput(
    key,
    target
) {

    if (
        !target ||
        !activeTargets.has(target)
    ) {
        return;
    }


    const targetValue =
        target.dataset.targetText;


    let typed =
        target.dataset.typedText ||
        "";


    totalAttempts++;
    totalCharacters++;


    const expectedCharacter =
        targetValue[
            typed.length
        ];


    /* -----------------------------------------
       CORRECT LETTER
    ----------------------------------------- */

    if (
        key === expectedCharacter
    ) {

        correctCharacters++;

        typed += key;


        target.dataset.typedText =
            typed;


        const targetLetters =
            target.querySelectorAll(
                ".target-letter"
            );


        const typedIndex =
            typed.length - 1;


        if (
            targetLetters[typedIndex]
        ) {

            targetLetters[
                typedIndex
            ].classList.add(
                "typed"
            );


            createSparkles(
                targetLetters[
                    typedIndex
                ]
            );

        }


        playTypingSound(true);


        /* -----------------------------------------
           WORD COMPLETE
        ----------------------------------------- */

        if (
            typed.length >=
            targetValue.length
        ) {

            score++;
            combo++;


            createCompletionBurst(
                target
            );


            removeTarget(
                target
            );


            activeTypingTarget =
                null;


            updateLevel();
            updateStats();

        } else {

            updateStats();

        }

    }


    /* -----------------------------------------
       WRONG LETTER
    ----------------------------------------- */

    else {

        combo = 0;

        showWrongEffect(
            target
        );

        updateStats();

    }
}


/* =========================================================
   REMOVE TARGET
   ========================================================= */

function removeTarget(target) {

    if (
        !target ||
        !activeTargets.has(target)
    ) {
        return;
    }


    activeTargets.delete(
        target
    );


    if (
        activeTypingTarget === target
    ) {

        activeTypingTarget =
            null;

    }


    if (target.parentNode) {
        target.remove();
    }
}


/* =========================================================
   REMOVE ALL TARGETS
   ========================================================= */

function removeAllTargets() {

    activeTargets.forEach(
        target => {

            if (
                target &&
                target.parentNode
            ) {

                target.remove();

            }

        }
    );


    activeTargets.clear();

    activeTypingTarget =
        null;
}
        /* -----------------------------------------
           WORD TARGET
           ----------------------------------------- */

        if (
            currentTarget.classList.contains(
                "word"
            )
        ) {

            handleWordInput(
                key
            );

        }


        /* -----------------------------------------
           LETTER TARGET
           ----------------------------------------- */

        else {

            handleLetterInput(
                key
            );

        }

    }
);


/* =========================================================
   LETTER INPUT
   ========================================================= */

function handleLetterInput(key) {

    if (
        key.length !== 1 ||
        !/[a-z]/.test(key)
    ) {
        return;
    }


    totalAttempts++;


    if (
        key === targetText
    ) {

        correctCharacters++;

        totalCharacters++;

        score++;

        combo++;


        showCorrectEffect();


        removeCurrentTarget();


        updateLevel();


        updateStats();


        scheduleNextTarget();

    } else {

        totalCharacters++;

        combo = 0;


        showWrongEffect();


        updateStats();

    }

}


/* =========================================================
   WORD INPUT
   ========================================================= */

function handleWordInput(key) {

    if (
        key.length !== 1 ||
        !/[a-z]/.test(key)
    ) {
        return;
    }

    totalAttempts++;
    totalCharacters++;

    const expectedCharacter =
        targetText[
            typedText.length
        ];

    /* -----------------------------------------
       CORRECT LETTER
    ----------------------------------------- */

    if (key === expectedCharacter) {

        correctCharacters++;

        typedText += key;

        // Find the letter that was just typed
        const letters =
            currentTarget.querySelectorAll(
                ".target-letter"
            );

        const typedIndex =
            typedText.length - 1;

        if (letters[typedIndex]) {

            letters[typedIndex].classList.add(
                "typed"
            );

            // Tiny sparkle effect
            createSparkles(
                letters[typedIndex]
            );
        }

        playTypingSound(true);

        /* -----------------------------------------
           WORD COMPLETE
        ----------------------------------------- */

        if (
            typedText.length >=
            targetText.length
        ) {

            score++;
            combo++;

            createCompletionBurst(
                currentTarget
            );

            removeCurrentTarget();

            updateLevel();
            updateStats();

            scheduleNextTarget();

        } else {

            updateStats();
        }

    }

    /* -----------------------------------------
       WRONG LETTER
    ----------------------------------------- */

    else {

        combo = 0;

        showWrongEffect();

        updateStats();
    }
}

/* =========================================================
   REMOVE CURRENT TARGET
   ========================================================= */

function removeCurrentTarget() {

    if (
        !currentTarget
    ) {
        return;
    }


    createBurst(
        currentTarget
    );


    currentTarget.remove();

    currentTarget = null;

}
/* =========================================================
   CORRECT EFFECT
   ========================================================= */

function showCorrectEffect(target) {

    if (!target) {
        return;
    }


    target.classList.add(
        "correct"
    );


    playTypingSound(true);


    setTimeout(() => {

        if (target) {

            target.classList.remove(
                "correct"
            );

        }

    }, 180);
}


/* =========================================================
   WRONG EFFECT
   ========================================================= */

function showWrongEffect(target) {

    if (!target) {
        return;
    }


    target.classList.remove(
        "shake",
        "wrong"
    );


    void target.offsetWidth;


    target.classList.add(
        "shake",
        "wrong"
    );


    playTypingSound(false);


    if (navigator.vibrate) {

        navigator.vibrate(
            [35, 25, 35]
        );

    }


    setTimeout(() => {

        if (target) {

            target.classList.remove(
                "wrong"
            );

        }

    }, 220);
}


/* =========================================================
   NEW COMPLETION EFFECT
   ========================================================= */

function createCompletionBurst(
    element
) {

    if (!element) {
        return;
    }


    const rect =
        element.getBoundingClientRect();


    const areaRect =
        gameArea.getBoundingClientRect();


    const centerX =
        rect.left -
        areaRect.left +
        rect.width / 2;


    const centerY =
        rect.top -
        areaRect.top +
        rect.height / 2;


    /* -----------------------------------------
       EXPANDING RING
    ----------------------------------------- */

    const ring =
        document.createElement(
            "div"
        );


    ring.className =
        "completion-ring";


    ring.style.left =
        `${centerX}px`;


    ring.style.top =
        `${centerY}px`;


    gameArea.appendChild(
        ring
    );


    /* -----------------------------------------
       PARTICLES
    ----------------------------------------- */

    const particleCount =
        element.classList.contains(
            "word"
        )
            ? 28
            : 14;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "completion-particle";


        particle.style.left =
            `${centerX}px`;


        particle.style.top =
            `${centerY}px`;


        const angle =
            Math.random() *
            Math.PI * 2;


        const distance =
            30 +
            Math.random() * 65;


        particle.style.setProperty(
            "--particle-x",
            `${Math.cos(angle) * distance}px`
        );


        particle.style.setProperty(
            "--particle-y",
            `${Math.sin(angle) * distance}px`
        );


        particle.style.animationDelay =
            `${Math.random() * 0.08}s`;


        gameArea.appendChild(
            particle
        );


        setTimeout(() => {

            particle.remove();

        }, 700);

    }


    /* -----------------------------------------
       CENTER FLASH
    ----------------------------------------- */

    const flash =
        document.createElement(
            "div"
        );


    flash.className =
        "completion-flash";


    flash.style.left =
        `${centerX}px`;


    flash.style.top =
        `${centerY}px`;


    gameArea.appendChild(
        flash
    );


    setTimeout(() => {

        ring.remove();
        flash.remove();

    }, 650);
}
/* =========================================================
   LEVEL
   ========================================================= */

function updateLevel() {

    level =
        Math.floor(
            score / 10
        ) + 1;


    levelElement.textContent =
        level;

}


/* =========================================================
   WPM
   ========================================================= */

function calculateWPM() {

    if (!startTime) {
        return 0;
    }


    const elapsed =
        (Date.now() - startTime) /
        60000;


    if (
        elapsed <= 0
    ) {
        return 0;
    }


    const words =
        correctCharacters / 5;


    return Math.round(
        words / elapsed
    );

}


/* =========================================================
   ACCURACY
   ========================================================= */

function calculateAccuracy() {

    if (
        totalCharacters <= 0
    ) {
        return 100;
    }


    return Math.round(
        (
            correctCharacters /
            totalCharacters
        ) * 100
    );

}


/* =========================================================
   UPDATE STATS
   ========================================================= */

function updateStats() {

    scoreElement.textContent =
        score;


    comboElement.textContent =
        combo;


    levelElement.textContent =
        level;


    wpmElement.textContent =
        calculateWPM();


    accuracyElement.textContent =
        calculateAccuracy() +
        "%";

}


/* =========================================================
   TYPING SOUND
   ========================================================= */

let audioContext = null;


function playTypingSound(correct) {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            audioContext.destination
        );


        oscillator.frequency.value =
            correct ? 600 : 180;


        oscillator.type =
            "sine";


        gain.gain.setValueAtTime(
            0.045,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.08
        );


        oscillator.start();


        oscillator.stop(
            audioContext.currentTime + 0.08
        );

    } catch (error) {

        console.log(
            "Typing sound unavailable."
        );

    }

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


pauseButton.addEventListener(
    "click",
    pauseGame
);


resumeButton.addEventListener(
    "click",
    resumeGame
);


restartButton.addEventListener(
    "click",
    restartGame
);


playAgainButton.addEventListener(
    "click",
    startGame
);


/* =========================================================
   UPDATE WPM WHILE PLAYING
   ========================================================= */

setInterval(() => {

    if (
        gameStarted &&
        !gamePaused
    ) {

        updateStats();

    }

}, 1000);


/* =========================================================
   INITIAL STATE
   ========================================================= */

gameControls.classList.remove(
    "visible"
);

pauseScreen.classList.remove(
    "show"
);

resultsScreen.classList.remove(
    "show"
);

console.log(
    "FlowType loaded successfully."
);
