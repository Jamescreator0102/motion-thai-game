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

  } catch (error) {
    console.error(error);
    debug("โหลดข้อมูลไม่สำเร็จ");
    alert("โหลดข้อมูลไม่สำเร็จ: " + error.message);
  }
}

function setupEvents() {
  document.getElementById("btnGoSelect").onclick = () => {
    renderStudents(students);
    showPage("selectPage");
  };

  document.getElementById("searchStudent").oninput = event => {
    const keyword = event.target.value.trim();
    const filtered = students.filter(student =>
      String(student.studentName).includes(keyword)
    );
    renderStudents(filtered);
  };

  document.getElementById("btnBackSelect").onclick = () => {
    showPage("selectPage");
  };

  document.getElementById("btnStartGame").onclick = async () => {
    try {
      if (!selectedStudent) {
        alert("กรุณาเลือกนักเรียนก่อนครับ");
        return;
      }

      showPage("gamePage");

      debug("กำลังเปิดกล้อง...");
      await openCamera();

      debug("กำลังเปิด AI Motion...");
      await setupPoseAI();

      debug("เริ่มเกม");
      startGame();

    } catch (error) {
      console.error(error);
      alert("เริ่มเกมไม่สำเร็จ: " + error.message);
      showPage("readyPage");
    }
  };

  document.getElementById("btnPlayAgain").onclick = () => {
    location.reload();
  };
}
