document.addEventListener("DOMContentLoaded", () => {
    let currentQuestionIndex = 0;
    let score = 0
    let level = 0;
    let levelsCount = 0;
    let questionsCount = 0;
    const quizieSubHeader = document.getElementById("quizie-sub-header");
    const questionContainer = document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const nextButton = document.getElementById("btn-next");
    const autoCorrectButton = document.getElementById("btn-auto-correct");
    const cardLevel = document.getElementById("card-level");

    fetch("./public/content/questions.json")
        .then(res => res.json())
        .then(data => {
            const questions = data.flatMap(category => category.questions);
            questionsCount = questions.length;
            showQuestion(questions[currentQuestionIndex]);
            showCard();
            autoCorrectButton.addEventListener("click", () => {
                const autoSelect = document.querySelector(`input[value="${questions[currentQuestionIndex].answer}"]`);
                autoSelect.checked = true;
            });
            nextButton.addEventListener("click", () => {
                const selectedOption = document.querySelector(`input[name="option"]:checked`);
                if (selectedOption) {
                    if (selectedOption.value === questions[currentQuestionIndex].answer) {
                        score++;
                    }
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        showQuestion(questions[currentQuestionIndex]);
                        showCard();
                    } else {
                        localStorage.setItem("quizScore", score);
                        localStorage.setItem("totalQuestions", questions.length);
                        window.location.href = "./public/pages/summary/summary.html";
                    }
                }
            });
            function showQuestion(question) {
                questionElement.textContent = question.question;
                optionsElement.innerHTML = '';
                question.options.forEach(option => {
                    const optionElement = document.createElement("div");
                    optionElement.innerHTML = `
                        <label>
                            <input type="radio" name="option" value="${option}">
                            ${option}
                        </label>
                    `;
                    optionsElement.appendChild(optionElement);
                    quizieSubHeader.innerHTML = `คำถามที่ <b>${currentQuestionIndex + 1}</b> จาก <b>${questions.length}</b> คำถาม`;
                });
            }
        });

    function showCard() {
        fetch("./public/content/card-levels.json")
        .then(res => res.json())
        .then(data => {
            levelsCount = Math.floor(questionsCount / data.length);
            level = Math.floor(score / levelsCount);
            if (level >= 4) {
                level = 3;
            } else if (level >= 3) {
                level = 2;
            }
            const cardUri = data[level].uri;
            getCard(cardUri);
            function getCard(uri) {
                cardLevel.style.backgroundImage = `url(${uri})`;
            };
        });
    }
});