document.addEventListener('DOMContentLoaded', () => {
    let questionsCount = localStorage.getItem("questionsCount");
    let cardLevels = localStorage.getItem("cardLevels");
    const summaryResult = document.getElementById('summary-result');
    const restartButton = document.getElementById('restart-button');
    const score = localStorage.getItem('quizScore');
    const totalQuestions = localStorage.getItem('totalQuestions');
    const rewardedCard = document.getElementById("card-level-summary");

    summaryResult.textContent = `คุณทำคะแนนได้: ${score} / ${totalQuestions}`;
    restartButton.addEventListener('click', () => {
        window.location.href = '../../../index.html';
    });

    showCard();

    function showCard() {
        fetch("./../../content/card-levels.json")
        .then(res => res.json())
        .then(data => {
            levelsCount = Math.floor(questionsCount / cardLevels);
            level = Math.floor(score / levelsCount);
            if (level >= 4) {
                level = 3;
            } else if (level >= 3) {
                level = 2;
            }
            const cardUri = data[level].uri;
            getCard(cardUri);

            function getCard(uri) {
                rewardedCard.style.backgroundImage = `url(./../../${cardUri})`;
            };
        });
    };
});