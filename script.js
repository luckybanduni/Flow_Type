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
