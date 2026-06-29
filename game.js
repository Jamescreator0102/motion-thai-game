let score = 0;
let correct = 0;
let wrong = 0;
let total = 0;
let timeLeft = 60;
let timer = null;
let currentQuestion = null;
let canAnswer = true;

function resetGame() {
  score = 0;
  correct = 0;
  wrong = 0;
  total = 0;
  timeLeft = 60;
  currentQuestion = null;
  canAnswer = true;

  updateHUD();
}

function startGame() {
  resetGame();
  nextQuestion();

  timer = setInterval(() => {
    timeLeft--;
    updateHUD();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  window.addEventListener("keydown", handleKeyboard);
}

function updateHUD() {
  document.getElementById("score").textContent = thaiNum(score);
  document.getElementById("time").textContent = thaiNum(timeLeft);
}

function nextQuestion() {
  if (!questions || questions.length === 0) {
    alert("ยังไม่มีโจทย์ในชีต Questions");
    return;
  }

  canAnswer = true;

  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];

  document.getElementById("questionText").textContent = currentQuestion.question;
  document.getElementById("leftBox").textContent = currentQuestion.leftWord;
  document.getElementById("rightBox").textContent = currentQuestion.rightWord;

  document.getElementById("leftBox").className = "answer-box";
  document.getElementById("rightBox").className = "answer-box";
  document.getElementById("feedback").textContent = "";
}

function chooseAnswer(side) {
  if (!canAnswer || !currentQuestion) return;

  canAnswer = false;
  total++;

  const correctSide = String(currentQuestion.correctSide).trim().toLowerCase();
  const isCorrect = side === correctSide;

  const targetBox = document.getElementById(side === "left" ? "leftBox" : "rightBox");

  if (isCorrect) {
    score += 10;
    correct++;
    targetBox.classList.add("correct");
    document.getElementById("feedback").textContent = "✅ ถูกต้อง +๑๐";
  } else {
    wrong++;
    targetBox.classList.add("wrong");
    document.getElementById("feedback").textContent = "❌ ผิด";
  }

  updateHUD();

  setTimeout(() => {
    if (timeLeft > 0) {
      nextQuestion();
    }
  }, 900);
}

function handleKeyboard(e) {
  if (e.key === "ArrowLeft") {
    chooseAnswer("left");
  }

  if (e.key === "ArrowRight") {
    chooseAnswer("right");
  }
}

async function endGame() {
  clearInterval(timer);
  window.removeEventListener("keydown", handleKeyboard);
  closeCamera();

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  document.getElementById("sumName").textContent = selectedStudent.studentName;
  document.getElementById("sumScore").textContent = thaiNum(score);
  document.getElementById("sumCorrect").textContent = thaiNum(correct);
  document.getElementById("sumWrong").textContent = thaiNum(wrong);
  document.getElementById("sumAccuracy").textContent = thaiNum(accuracy);

  try {
    await saveScoreToAPI({
      className: selectedStudent.className,
      studentName: selectedStudent.studentName,
      score,
      correct,
      wrong,
      total,
      accuracy
    });
  } catch (error) {
    console.error(error);
  }

  showPage("pageSummary");
}
