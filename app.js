document.addEventListener("DOMContentLoaded", () => {
    let currentQuestionIndex = 0;
    let score = 0;
    const quizieSubHeader = document.getElementById("quizie-sub-header");
    const questionContainer = document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const nextButton = document.getElementById("next-button");

    fetch("./public/content/questions.json")
        .then(response => response.json())
        .then(data => {
            const questions = data.flatMap(category => category.questions);
            showQuestion(questions[currentQuestionIndex]);

            nextButton.addEventListener("click", () => {
                const selectedOption = document.querySelector(`input[name="option"]:checked`);
                if (selectedOption) {
                    if (selectedOption.value === questions[currentQuestionIndex].answer) {
                        score++;
                    }
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        showQuestion(questions[currentQuestionIndex]);
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
});