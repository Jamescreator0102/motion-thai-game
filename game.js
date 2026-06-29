let scoreValue = 0;
let correctValue = 0;
let wrongValue = 0;
let totalValue = 0;
let timeLeftValue = 60;
let timerId = null;
let currentQuestion = null;

window.canAnswer = false;

const MAX_WRONG = 3;

function startGame() {
  scoreValue = 0;
  correctValue = 0;
  wrongValue = 0;
  totalValue = 0;
  timeLeftValue = 60;
  currentQuestion = null;
  window.canAnswer = true;

  updateHUD();
  nextQuestion();

  timerId = setInterval(() => {
    timeLeftValue--;
    updateHUD();

    if (timeLeftValue <= 0) {
      endGame();
    }
  }, 1000);

  window.addEventListener("keydown", handleKeyboard);
}

function updateHUD() {
  document.getElementById("score").textContent = thaiNum(scoreValue);
  document.getElementById("time").textContent = thaiNum(timeLeftValue);
}

function nextQuestion() {
  if (!questions || questions.length === 0) {
    alert("ยังไม่มีโจทย์ในชีต Questions");
    return;
  }

  window.canAnswer = true;

  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];

  document.getElementById("questionText").textContent = currentQuestion.question;
  document.querySelector("#leftBox .word").textContent = currentQuestion.leftWord;
  document.querySelector("#rightBox .word").textContent = currentQuestion.rightWord;

  document.getElementById("leftBox").className = "answer-card left-card";
  document.getElementById("rightBox").className = "answer-card right-card";
  document.getElementById("feedback").textContent = "";
}

function chooseAnswer(side) {
  if (!window.canAnswer || !currentQuestion) return;

  window.canAnswer = false;
  totalValue++;

  const correctSide = String(currentQuestion.correctSide).trim().toLowerCase();
  const isCorrect = side === correctSide;
  const targetBox = document.getElementById(side === "left" ? "leftBox" : "rightBox");

  if (isCorrect) {
    scoreValue += 10;
    correctValue++;
    targetBox.classList.add("correct");
    document.getElementById("feedback").textContent = "⭐ ถูกต้อง +๑๐";
    playCorrectSound();
  } else {
    wrongValue++;
    targetBox.classList.add("wrong");
    playWrongSound();

    if (wrongValue >= MAX_WRONG) {
      document.getElementById("feedback").textContent = "💥 ผิดครบ ๓ ครั้ง จบเกม!";
      updateHUD();

      setTimeout(() => {
        endGame();
      }, 1200);

      return;
    }

    document.getElementById("feedback").textContent =
      `❌ ผิด เหลือโอกาส ${thaiNum(MAX_WRONG - wrongValue)} ครั้ง`;
  }

  updateHUD();

  setTimeout(() => {
    if (timeLeftValue > 0) {
      nextQuestion();
    }
  }, 900);
}

function handleKeyboard(e) {
  if (e.key === "ArrowLeft") chooseAnswer("left");
  if (e.key === "ArrowRight") chooseAnswer("right");
}

async function endGame() {
  clearInterval(timerId);
  timerId = null;

  window.removeEventListener("keydown", handleKeyboard);
  window.canAnswer = false;

  if (typeof stopPoseAI === "function") stopPoseAI();
  if (typeof closeCamera === "function") closeCamera();

  const accuracy = totalValue > 0 ? Math.round((correctValue / totalValue) * 100) : 0;

  document.getElementById("sumName").textContent = selectedStudent.studentName;
  document.getElementById("sumScore").textContent = thaiNum(scoreValue);
  document.getElementById("sumCorrect").textContent = thaiNum(correctValue);
  document.getElementById("sumWrong").textContent = thaiNum(wrongValue);
  document.getElementById("sumAccuracy").textContent = thaiNum(accuracy);

  try {
    await saveScoreToAPI({
      className: selectedStudent.className,
      studentName: selectedStudent.studentName,
      score: scoreValue,
      correct: correctValue,
      wrong: wrongValue,
      total: totalValue,
      accuracy: accuracy
    });
  } catch (err) {
    console.error(err);
  }

  showPage("pageSummary");
}
