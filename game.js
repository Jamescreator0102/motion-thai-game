const gameState = {
  score: 0,
  correct: 0,
  wrong: 0,
  total: 0,
  timeLeft: 60,
  timer: null,
  currentQuestion: null,
  canAnswer: false,
  maxWrong: 3
};

function startGame() {
  gameState.score = 0;
  gameState.correct = 0;
  gameState.wrong = 0;
  gameState.total = 0;
  gameState.timeLeft = 60;
  gameState.currentQuestion = null;
  gameState.canAnswer = true;

  updateHUD();
  nextQuestion();

  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    updateHUD();

    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  window.addEventListener("keydown", handleKeyboard);
}

function updateHUD() {
  document.getElementById("score").textContent = thaiNumber(gameState.score);
  document.getElementById("time").textContent = thaiNumber(gameState.timeLeft);
}

function nextQuestion() {
  if (!questions || questions.length === 0) {
    alert("ยังไม่มีโจทย์ในชีต Questions");
    return;
  }

  gameState.canAnswer = true;

  const randomIndex = Math.floor(Math.random() * questions.length);
  gameState.currentQuestion = questions[randomIndex];

  document.getElementById("questionText").textContent =
    gameState.currentQuestion.question;

  document.querySelector("#leftBox .word").textContent =
    gameState.currentQuestion.leftWord;

  document.querySelector("#rightBox .word").textContent =
    gameState.currentQuestion.rightWord;

  document.getElementById("leftBox").className = "answer-card left-card";
  document.getElementById("rightBox").className = "answer-card right-card";
  document.getElementById("feedback").textContent = "";
}

function chooseAnswer(side) {
  if (!gameState.canAnswer || !gameState.currentQuestion) return;

  gameState.canAnswer = false;
  gameState.total++;

  const correctSide = String(gameState.currentQuestion.correctSide)
    .trim()
    .toLowerCase();

  const isCorrect = side === correctSide;
  const targetBox = document.getElementById(side === "left" ? "leftBox" : "rightBox");

  targetBox.classList.add("active");

  if (isCorrect) {
    gameState.score += 10;
    gameState.correct++;
    targetBox.classList.add("correct");
    document.getElementById("feedback").textContent = "⭐ ถูกต้อง +๑๐";
    playCorrectSound();
  } else {
    gameState.wrong++;
    targetBox.classList.add("wrong");
    playWrongSound();

    if (gameState.wrong >= gameState.maxWrong) {
      document.getElementById("feedback").textContent = "💥 ผิดครบ ๓ ครั้ง จบเกม!";
      updateHUD();

      setTimeout(() => {
        endGame();
      }, 1200);

      return;
    }

    document.getElementById("feedback").textContent =
      `❌ ผิด เหลือโอกาส ${thaiNumber(gameState.maxWrong - gameState.wrong)} ครั้ง`;
  }

  updateHUD();

  setTimeout(() => {
    if (gameState.timeLeft > 0) {
      nextQuestion();
    }
  }, 900);
}

function handleKeyboard(event) {
  if (event.key === "ArrowLeft") chooseAnswer("left");
  if (event.key === "ArrowRight") chooseAnswer("right");
}

async function endGame() {
  if (gameState.timer) {
    clearInterval(gameState.timer);
    gameState.timer = null;
  }

  window.removeEventListener("keydown", handleKeyboard);
  gameState.canAnswer = false;

  if (typeof stopPoseAI === "function") stopPoseAI();
  if (typeof closeCamera === "function") closeCamera();

  const accuracy =
    gameState.total > 0
      ? Math.round((gameState.correct / gameState.total) * 100)
      : 0;

  document.getElementById("sumName").textContent = selectedStudent.studentName;
  document.getElementById("sumScore").textContent = thaiNumber(gameState.score);
  document.getElementById("sumCorrect").textContent = thaiNumber(gameState.correct);
  document.getElementById("sumWrong").textContent = thaiNumber(gameState.wrong);
  document.getElementById("sumAccuracy").textContent = thaiNumber(accuracy);

  try {
    await saveScoreToAPI({
      className: selectedStudent.className,
      studentName: selectedStudent.studentName,
      score: gameState.score,
      correct: gameState.correct,
      wrong: gameState.wrong,
      total: gameState.total,
      accuracy
    });
  } catch (error) {
    console.error(error);
  }

  showPage("summaryPage");
}
