const thaiDigits = "๐๑๒๓๔๕๖๗๘๙";

function thaiNum(value) {
  return String(value).replace(/\d/g, d => thaiDigits[d]);
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
  document.getElementById(pageId).classList.add("active");
}

function renderStudents(list) {
  const box = document.getElementById("studentList");
  box.innerHTML = "";

  if (!list || list.length === 0) {
    box.innerHTML = `<div class="student-item">ไม่พบรายชื่อนักเรียน</div>`;
    return;
  }

  list.forEach(stu => {
    const item = document.createElement("div");
    item.className = "student-item";
    item.textContent = `เลขที่ ${thaiNum(stu.studentNo)} ${stu.studentName}`;

    item.onclick = () => {
      selectedStudent = stu;

      document.getElementById("readyName").textContent = stu.studentName;
      document.getElementById("readyClass").textContent =
        `${stu.className} เลขที่ ${thaiNum(stu.studentNo)}`;
      document.getElementById("playerName").textContent = stu.studentName;

      showPage("pageReady");
    };

    box.appendChild(item);
  });
}
