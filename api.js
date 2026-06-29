let students = [];
let questions = [];
let selectedStudent = null;

document.addEventListener("DOMContentLoaded", async () => {
  debug("กำลังโหลดข้อมูล...");

  students = await getStudentsFromAPI();
  questions = await getQuestionsFromAPI();

  debug(`โหลดรายชื่อ ${students.length} คน | โหลดโจทย์ ${questions.length} ข้อ`);

  document.getElementById("btnGoSelect").addEventListener("click", () => {
    showPage("pageSelect");
    renderStudents(students);
  });

  document.getElementById("btnBackSelect").addEventListener("click", () => {
    showPage("pageSelect");
  });

  document.getElementById("btnPlayAgain").addEventListener("click", () => {
    location.reload();
  });

  document.getElementById("searchStudent").addEventListener("input", e => {
    const keyword = e.target.value.trim();
    const filtered = students.filter(stu =>
      String(stu.studentName).includes(keyword)
    );
    renderStudents(filtered);
  });

  document.getElementById("btnStartGame").addEventListener("click", async () => {
    showPage("pageGame");
    await openCamera();
    await setupPoseAI();
    startGame();
  });
});
