let students = [];
let questions = [];
let selectedStudent = null;

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  try {
    debug("กำลังโหลดข้อมูล...");

    students = await getStudentsFromAPI();
    questions = await getQuestionsFromAPI();

    debug(`โหลดรายชื่อ ${students.length} คน | โหลดโจทย์ ${questions.length} ข้อ`);
    setupEvents();

  } catch (err) {
    console.error(err);
    debug("โหลดข้อมูลไม่สำเร็จ");
    alert("โหลดข้อมูลไม่สำเร็จ: " + err.message);
  }
}

function setupEvents() {
  btnGoSelect.onclick = () => {
    renderStudents(students);
    showPage("pageSelect");
  };

  searchStudent.oninput = e => {
    const key = e.target.value.trim();
    renderStudents(students.filter(s => String(s.studentName).includes(key)));
  };

  btnBackSelect.onclick = () => {
    showPage("pageSelect");
  };

  btnStartGame.onclick = async () => {
    try {
      showPage("pageGame");
      debug("กำลังเปิดกล้อง...");
      await openCamera();

      debug("กำลังเปิด AI Motion...");
      await setupPoseAI();

      debug("เริ่มเกม");
      startGame();

    } catch (err) {
      console.error(err);
      alert("เริ่มเกมไม่สำเร็จ: " + err.message);
      showPage("pageReady");
    }
  };

  btnPlayAgain.onclick = () => {
    location.reload();
  };
}
