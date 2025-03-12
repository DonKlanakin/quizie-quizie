const cards = "./public/content/card-levels.json";
const startScreen = document.getElementById("start-screen");
const mainScreen = document.getElementById("main-screen");
const summaryScreen = document.getElementById("summary-screen");
const quizieSubHeader = document.getElementById("quizie-sub-header");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("btn-next");
const autoCorrectButton = document.getElementById("btn-auto-correct");
const cardBeginer = document.getElementById("card-beginer");
const cardIntermediate = document.getElementById("card-intermediate");
const cardExpert = document.getElementById("card-expert");
const cardLevel = document.getElementById("card-level");
const cardCommonCaterPillar = new Image();
const cardRareCocoon = new Image();
const cardEliteMagicalButterfly = new Image();
const cardLegendaryFairyGoddess = new Image();
let questions = "";
let currentQuestionIndex = 0;
let score = 0;
let level = 0;
let cardsCollection = [];
let questionsCount = 0;
let questionsList = [];
let rewardedCardUri = 0;

const SCREENS = Object.freeze({
    START: "START",
    MAIN: "MAIN",
    SUMMARY: "SUMMARY"
});

(async function main() {
    const logPrefix = "main";
    try {
        await preload();

    } catch (error) {
        console.error(`${logPrefix} :: ${error}`);
    }
})();

async function preload() {
    const logPrefix = "preload";
    try {
        await preloadCards(cards);

    } catch (error) {
        console.error(`${logPrefix} :: ${error}`);
    }
}

async function preloadCards(uri) {
    const logPrefix = "preloadCards";
    try {
        let uriPrefix = "./public/";
        let res = await fetch(uri);
        let data = await res.json();

        let cardImages = [
            { card: cardCommonCaterPillar, uri: data[0].uri },
            { card: cardRareCocoon, uri: data[1].uri },
            { card: cardEliteMagicalButterfly, uri: data[2].uri },
            { card: cardLegendaryFairyGoddess, uri: data[3].uri },
        ];

        await Promise.all(
            cardImages.map(({ card, uri }) =>
                new Promise((resolve) => {
                    card.src = uriPrefix + uri;
                    card.onload = resolve;
                    card.onerror = resolve;
                })
            )
        );

        cardsCollection = cardImages;

        cardBeginer.addEventListener("click", () => {
            questions = "./public/content/questions-beginner.json";
            processTransition(SCREENS.MAIN);
        });

        cardIntermediate.addEventListener("click", () => {
            questions = "./public/content/questions-intermediate.json";
            processTransition(SCREENS.MAIN);
        });

        cardExpert.addEventListener("click", () => {
            questions = "./public/content/questions-Expert.json";
            processTransition(SCREENS.MAIN);
        });

    } catch (error) {
        console.error(`${logPrefix} :: ${error}`);
    }
}

async function loadQuestions() {
    const logPrefix = "loadQuestions";
    try {
        const res = await fetch(questions);
        const data = await res.json();

        questionsList = data.flatMap((category) => category.questions);
        questionsCount = questionsList.length;
        localStorage.setItem("questionsCount", questionsCount);

        showQuestion(questionsList[currentQuestionIndex]);
        showCard();

        nextButton.addEventListener("click", () => {
            const selectedOption = document.querySelector(`input[name="option"]:checked`);
            if (selectedOption) {
                if (selectedOption.value === questionsList[currentQuestionIndex].answer) {
                    score++;
                }
                currentQuestionIndex++;
                if (currentQuestionIndex < questionsList.length) {
                    showQuestion(questionsList[currentQuestionIndex]);
                    showCard();
                } else {
                    localStorage.setItem("quizScore", score);
                    localStorage.setItem("totalQuestions", questionsList.length);
                    window.location.href = "./public/pages/summary/summary.html";
                    //processTransition(SCREENS.SUMMARY);
                }
            }
        });

        autoCorrectButton.addEventListener("click", () => {
            const autoSelect = document.querySelector(
                `input[value="${questionsList[currentQuestionIndex].answer}"]`
            );
            autoSelect.checked = true;
        });

    } catch (error) {
        console.error(`${logPrefix} :: ${error}`);
    }
}

function showCard() {
    const logPrefix = "showCard";
    try {
        // Exclude legendary card from distribution
        const cardLevelsCount = cardsCollection.length - 1;
        const levelThreshold = Math.floor(questionsCount / cardLevelsCount);
        level = Math.floor(score / levelThreshold);

        // Ensure the last card is "Legendary Fairy Goddess" and only given to a full-scored player
        if (score === questionsCount) {
            level = cardLevelsCount;
        } else if (level >= cardLevelsCount) {
            level = cardLevelsCount - 1;
        }

        localStorage.setItem("cardLevelsCount", cardLevelsCount);
        localStorage.setItem("rewardedCardUri", level);

        setCard(level);

        function setCard(level) {
            cardLevel.style.backgroundImage = `url(${cardsCollection[level].card.src})`;
        }

    } catch (error) {
        console.error(`${logPrefix} :: ${error}`);
    }
}

function showQuestion(question) {
    const logPrefix = "showQuestion";
    try {
        questionElement.textContent = question.question;
        optionsElement.innerHTML = "";
        question.options.forEach((option) => {
            const optionElement = document.createElement("div");
            optionElement.innerHTML = `
                <label>
                    <input type="radio" name="option" value="${option}">
                    ${option}
                </label>
            `;
            optionsElement.appendChild(optionElement);
        });

        quizieSubHeader.innerHTML = `คำถามที่ <b>${currentQuestionIndex + 1}</b> จาก <b>${questionsList.length}</b> คำถาม`;
        
    } catch (error) {
        console.error(`${logPrefix} :: ${error}`);
    }
}

function processTransition(screen) {
    switch (screen) {
        case SCREENS.START:
            processResetGame();
            startScreen.style.display = "flex";
            mainScreen.style.display = "none";
            summaryScreen.style.display = "none"
            setTimeout(() => {
                startScreen.style.opacity = "1";
            }, 200);
            loadQuestions();
            break;
        case SCREENS.MAIN:
            startScreen.style.display = "none";
            mainScreen.style.display = "flex";
            summaryScreen.style.display = "none"
            setTimeout(() => {
                mainScreen.style.opacity = "1";
            }, 200);
            loadQuestions();
            break;
        case SCREENS.SUMMARY:
            startScreen.style.display = "none";
            mainScreen.style.display = "none";
            summaryScreen.style.display = "flex"
            setTimeout(() => {
                summaryScreen.style.opacity = "1";
            }, 200);
            break;
    
        default:
            break;
    }
}

// function processResetGame(params) {
//     questions = "";
//     currentQuestionIndex = 0;
//     score = 0;
//     level = 0;
//     cardsCollection = [];
//     questionsCount = 0;
//     questionsList = [];
//     rewardedCardUri = 0;
//     startScreen.style.opacity = "1";
//     mainScreen.style.opacity = "0";
//     summaryScreen.style.opacity = "0"
// }

