let score = 0;
let correct = 0;
let wrong = 0;
let total = 0;
let timeLeft = 60;
let timer = null;
let currentQuestion = null;
let canAnswer = false;

function startGame() {
  score = 0;
  correct = 0;
  wrong = 0;
  total = 0;
  timeLeft = 60;
  canAnswer = true;

  updateHUD();
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
  document.querySelector("#leftBox .word").textContent = currentQuestion.leftWord;
  document.querySelector("#rightBox .word").textContent = currentQuestion.rightWord;

  leftBox.className = "answer-card left-card";
  rightBox.className = "answer-card right-card";
  feedback.textContent = "";
}

function chooseAnswer(side) {
  wrong++;
target.classList.add("wrong");
playWrongSound();

if (wrong >= 3) {
  feedback.textContent = "❌ ผิดครบ ๓ ครั้ง จบเกม!";
  setTimeout(() => {
    endGame();
  }, 900);
  return;
} else {
  feedback.textContent = `❌ ผิด เหลือโอกาส ${thaiNum(3 - wrong)} ครั้ง`;
}

if (wrong >= 3) {
  feedback.textContent = "❌ ผิดครบ ๓ ครั้ง จบเกม!";
  setTimeout(() => {
    endGame();
  }, 900);
  return;
} else {
  feedback.textContent = `❌ ผิด เหลือโอกาส ${thaiNum(3 - wrong)} ครั้ง`;
}
  updateHUD();

  setTimeout(() => {
    if (timeLeft > 0) {
      nextQuestion();
    }
  }, 900);
}

function handleKeyboard(e) {
  if (e.key === "ArrowLeft") chooseAnswer("left");
  if (e.key === "ArrowRight") chooseAnswer("right");
}

async function endGame() {
  clearInterval(timer);
  window.removeEventListener("keydown", handleKeyboard);

  canAnswer = false;
  stopPoseAI();
  closeCamera();

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  sumName.textContent = selectedStudent.studentName;
  sumScore.textContent = thaiNum(score);
  sumCorrect.textContent = thaiNum(correct);
  sumWrong.textContent = thaiNum(wrong);
  sumAccuracy.textContent = thaiNum(accuracy);

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
  } catch (err) {
    console.error(err);
  }

  showPage("pageSummary");
}
