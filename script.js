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

let currentTarget = null;

let targetText = "";

let typedText = "";


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

const letters =
    "abcdefghijklmnopqrstuvwxyz";


const words = [

    "code",
    "flow",
    "type",
    "focus",
    "speed",
    "keyboard",
    "computer",
    "design",
    "create",
    "learn",
    "dream",
    "future",
    "simple",
    "practice",
    "developer",
    "javascript",
    "website",
    "coding",
    "gaming",
    "creative"

];


/* =========================================================
   RANDOM NUMBER
   ========================================================= */

function randomNumber(min, max) {

    return Math.random() *
        (max - min) +
        min;

}


/* =========================================================
   CREATE RANDOM TARGET
   ========================================================= */

function createTarget() {

    if (!gameStarted || gamePaused) {
        return;
    }

    const element = document.createElement("div");

    const isWord = Math.random() < 0.4;

    if (isWord) {

        targetText =
            words[
                Math.floor(
                    Math.random() * words.length
                )
            ];

        element.classList.add(
            "game-item",
            "word"
        );

        // Create individual letters
        [...targetText].forEach((char, index) => {

            const letter = document.createElement("span");

            letter.className = "target-letter";
            letter.textContent = char;

            letter.dataset.index = index;

            element.appendChild(letter);

        });

    } else {

        targetText =
            letters[
                Math.floor(
                    Math.random() * letters.length
                )
            ];

        element.classList.add("game-item");

        element.textContent = targetText;
    }

    /* -----------------------------------------
       POSITION
    ----------------------------------------- */

    const areaWidth =
        gameArea.clientWidth;

    const itemWidth =
        isWord ? 110 : 55;

    const randomX =
        randomNumber(
            20,
            Math.max(
                21,
                areaWidth - itemWidth - 20
            )
        );

    const randomY = -60;

    element.style.left =
        `${randomX}px`;

    element.style.top =
        `${randomY}px`;

    gameArea.appendChild(element);

    currentTarget = element;

    typedText = "";

    /* -----------------------------------------
       START FALLING
    ----------------------------------------- */

    animateTarget(element);
}

/* =========================================================
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


        if (
            !currentTarget
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


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

function showCorrectEffect() {

    if (!currentTarget) {
        return;
    }

    currentTarget.classList.add("correct");

    playTypingSound(true);

    setTimeout(() => {

        if (currentTarget) {

            currentTarget.classList.remove(
                "correct"
            );

        }

    }, 180);
}

/* =========================================================
   WRONG EFFECT
   ========================================================= */
function showWrongEffect() {

    if (!currentTarget) {
        return;
    }

    currentTarget.classList.remove(
        "shake",
        "wrong"
    );

    void currentTarget.offsetWidth;

    currentTarget.classList.add(
        "shake",
        "wrong"
    );

    playTypingSound(false);

    // Phone vibration
    if (navigator.vibrate) {
        navigator.vibrate([35, 25, 35]);
    }

    setTimeout(() => {

        if (currentTarget) {

            currentTarget.classList.remove(
                "wrong"
            );

        }

    }, 220);
}


/* =========================================================
   BURST EFFECT
   ========================================================= */

function createBurst(element) {

    if (!element) {
        return;
    }

    const burst =
        document.createElement("div");

    burst.className = "burst";

    burst.style.left =
        element.offsetLeft +
        element.offsetWidth / 2 +
        "px";

    burst.style.top =
        element.offsetTop +
        element.offsetHeight / 2 +
        "px";

    gameArea.appendChild(burst);

    setTimeout(() => {
        burst.remove();
    }, 600);
}
/* =========================================================
   TINY SPARKLES
   ========================================================= */

function createSparkles(element) {

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

    const sparkleCount = 5;

    for (
        let i = 0;
        i < sparkleCount;
        i++
    ) {

        const sparkle =
            document.createElement("span");

        sparkle.className =
            "sparkle";

        sparkle.style.left =
            `${centerX}px`;

        sparkle.style.top =
            `${centerY}px`;

        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            12 +
            Math.random() * 20;

        sparkle.style.setProperty(
            "--spark-x",
            `${Math.cos(angle) * distance}px`
        );

        sparkle.style.setProperty(
            "--spark-y",
            `${Math.sin(angle) * distance}px`
        );

        sparkle.style.animationDelay =
            `${Math.random() * 0.05}s`;

        gameArea.appendChild(
            sparkle
        );

        setTimeout(() => {
            sparkle.remove();
        }, 450);
    }
}


/* =========================================================
   WORD COMPLETION BURST
   ========================================================= */

function createCompletionBurst(element) {

    if (!element) {
        return;
    }

    // Main burst
    createBurst(element);

    // Extra sparkle explosion
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

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const sparkle =
            document.createElement("span");

        sparkle.className =
            "sparkle completion";

        sparkle.style.left =
            `${centerX}px`;

        sparkle.style.top =
            `${centerY}px`;

        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            25 +
            Math.random() * 45;

        sparkle.style.setProperty(
            "--spark-x",
            `${Math.cos(angle) * distance}px`
        );

        sparkle.style.setProperty(
            "--spark-y",
            `${Math.sin(angle) * distance}px`
        );

        sparkle.style.animationDelay =
            `${Math.random() * 0.08}s`;

        gameArea.appendChild(
            sparkle
        );

        setTimeout(() => {
            sparkle.remove();
        }, 650);
    }
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
