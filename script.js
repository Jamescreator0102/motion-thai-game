let students = [];
let questions = [];
let selectedStudent = null;

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

async function initApp() {
  try {
    debug("กำลังโหลดรายชื่อและโจทย์...");

    students = await getStudentsFromAPI();
    questions = await getQuestionsFromAPI();

    debug(`โหลดรายชื่อ ${students.length} คน | โหลดโจทย์ ${questions.length} ข้อ`);

    renderStudents(students);
    setupEvents();

  } catch (error) {
    debug("โหลดข้อมูลไม่สำเร็จ");
    alert("โหลดข้อมูลไม่สำเร็จ: " + error.message);
    console.error(error);
  }
}

function renderStudents(list) {
  const studentList = document.getElementById("studentList");
  studentList.innerHTML = "";

  if (!list || list.length === 0) {
    studentList.innerHTML = `<div class="student">ไม่พบรายชื่อนักเรียน</div>`;
    return;
  }

  list.forEach(stu => {
    const item = document.createElement("div");
    item.className = "student";
    item.textContent = `เลขที่ ${thaiNum(stu.studentNo)} ${stu.studentName}`;

    item.addEventListener("click", () => {
      selectStudent(stu);
    });

    studentList.appendChild(item);
  });
}

function selectStudent(stu) {
  selectedStudent = stu;

  document.getElementById("readyName").textContent = stu.studentName;
  document.getElementById("readyClass").textContent =
    `${stu.className} เลขที่ ${thaiNum(stu.studentNo)}`;

  document.getElementById("playerName").textContent = stu.studentName;

  showPage("pageReady");
}

function setupEvents() {
  document.getElementById("searchStudent").addEventListener("input", e => {
    const keyword = e.target.value.trim();

    const filtered = students.filter(stu =>
      String(stu.studentName).includes(keyword)
    );

    renderStudents(filtered);
  });

  document.getElementById("btnBackSelect").addEventListener("click", () => {
    showPage("pageSelect");
  });

  document.getElementById("btnStartGame").addEventListener("click", () => {
    alert("ขั้นต่อไปเราจะเชื่อมกล้องและเริ่มเกมครับ");
  });

  document.getElementById("btnPlayAgain").addEventListener("click", () => {
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", initApp);
