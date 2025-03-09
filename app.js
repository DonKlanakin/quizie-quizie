const cards = "./public/content/card-levels.json";
const questions = "./public/content/questions-intermediate.json";
const startScreen = document.getElementById("start-screen");
const mainScreen = document.getElementById("main-screen");
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
let currentQuestionIndex = 0;
let score = 0;
let level = 0;
let cardsCollection = [];
let playerLevelsCount = 0;
let cardLevelsCount = 0;
let questionsCount = 0;
let questionsList = [];

(async function main() {
  const logPrefix = "main";
  try {
    await preload();
    await loadQuestions();
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

    cardLevelsCount = data.length;
    let cardImages = [
      { card: cardCommonCaterPillar, uri: data[0].uri },
      { card: cardRareCocoon, uri: data[1].uri },
      { card: cardEliteMagicalButterfly, uri: data[2].uri },
      { card: cardLegendaryFairyGoddess, uri: data[3].uri },
    ];

    await Promise.all(
      cardImages.map(
        ({ card, uri }) =>
          new Promise((resolve) => {
            card.src = uriPrefix + uri;
            card.onload = () => resolve();
            card.onerror = () => resolve();
          })
      )
    );

    cardsCollection = cardImages;

    cardBeginer.addEventListener("click", ()=> {
        processTransition();
    });

    cardIntermediate.addEventListener("click", ()=> {
        processTransition();
    });

    cardExpert.addEventListener("click", ()=> {
        processTransition();
    });

    function processTransition() {
        startScreen.style.display = "none";
        mainScreen.style.display = "flex";
        setTimeout(()=>{
            mainScreen.style.opacity = "1";
        }, 200);
    }

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
    showCard(level);

    nextButton.addEventListener("click", () => {
      const selectedOption = document.querySelector(
        `input[name="option"]:checked`
      );
      if (selectedOption) {
        if (
          selectedOption.value === questionsList[currentQuestionIndex].answer
        ) {
          score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questionsList.length) {
          showQuestion(questionsList[currentQuestionIndex]);
          showCard(level);
        } else {
          localStorage.setItem("quizScore", score);
          localStorage.setItem("totalQuestions", questionsList.length);
          window.location.href = "./public/pages/summary/summary.html";
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
    playerLevelsCount = Math.floor(
      questionsCount / (cardLevelsCount === 0 ? 1 : cardLevelsCount)
    );
    level = Math.floor(
      score / (playerLevelsCount === 0 ? 1 : playerLevelsCount)
    );

    if (level >= cardLevelsCount) {
      level = cardLevelsCount - 1;
    } else if (level >= cardLevelsCount - 1) {
      level = cardLevelsCount - 2;
    }

    localStorage.setItem("cardLevelsCount", cardLevelsCount);
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

    quizieSubHeader.innerHTML = `คำถามที่ <b>${
      currentQuestionIndex + 1
    }</b> จาก <b>${questionsList.length}</b> คำถาม`;
  } catch (error) {
    console.error(`${logPrefix} :: ${error}`);
  }
}
