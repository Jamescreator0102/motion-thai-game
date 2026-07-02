const THAI_DIGITS = "๐๑๒๓๔๕๖๗๘๙";

function thaiNumber(value) {
  return String(value).replace(/\d/g, d => THAI_DIGITS[d]);
}

function debug(message) {
  const box = document.getElementById("debugBox");
  if (box) box.textContent = message;
  console.log(message);
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");
}

function renderStudents(studentList) {
  const container = document.getElementById("studentList");
  container.innerHTML = "";

  if (!studentList || studentList.length === 0) {
    container.innerHTML = `<div class="student-item">ไม่พบรายชื่อนักเรียน</div>`;
    return;
  }

  studentList.forEach(student => {
    const card = document.createElement("div");
    card.className = "student-item";
    card.textContent = `เลขที่ ${thaiNumber(student.studentNo)} ${student.studentName}`;

    card.onclick = () => {
      selectedStudent = student;

      document.getElementById("readyName").textContent = student.studentName;
      document.getElementById("readyClass").textContent =
        `${student.className} เลขที่ ${thaiNumber(student.studentNo)}`;
      document.getElementById("playerName").textContent = student.studentName;

      showPage("readyPage");
    };

    container.appendChild(card);
  });
}
