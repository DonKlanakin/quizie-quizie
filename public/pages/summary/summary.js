document.addEventListener('DOMContentLoaded', () => {
    const summaryResult = document.getElementById('summary-result');
    const restartButton = document.getElementById('restart-button');
    const score = localStorage.getItem('quizScore');
    const totalQuestions = localStorage.getItem('totalQuestions');

    summaryResult.textContent = `Your score: ${score} / ${totalQuestions}`;
    restartButton.addEventListener('click', () => {
        window.location.href = '/../../../index.html';
    });
});