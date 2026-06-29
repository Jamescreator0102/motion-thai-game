// ==============================
// Thai Motion Quest
// app.js
// ==============================

let students = [];
let questions = [];
let selectedStudent = null;

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {

    debug("กำลังโหลดข้อมูล...");

    try {

        students = await getStudentsFromAPI();
        questions = await getQuestionsFromAPI();

        debug(`โหลดรายชื่อ ${students.length} คน | โหลดโจทย์ ${questions.length} ข้อ`);

        setupEvents();

    } catch (err) {

        console.error(err);

        alert("ไม่สามารถโหลดข้อมูลจาก Google Sheets ได้");

    }

}

function setupEvents() {

    //-------------------------
    // หน้าแรก
    //-------------------------

    document
        .getElementById("btnGoSelect")
        .addEventListener("click", () => {

            renderStudents(students);

            showPage("pageSelect");

        });

    //-------------------------
    // ค้นหานักเรียน
    //-------------------------

    document
        .getElementById("searchStudent")
        .addEventListener("input", e => {

            const keyword = e.target.value.trim();

            const filtered = students.filter(student =>
                student.studentName.includes(keyword)
            );

            renderStudents(filtered);

        });

    //-------------------------
    // Ready
    //-------------------------

    document
        .getElementById("btnBackSelect")
        .addEventListener("click", () => {

            showPage("pageSelect");

        });

    //-------------------------
    // เริ่มเกม
    //-------------------------

    document
        .getElementById("btnStartGame")
        .addEventListener("click", async () => {

            try {

                showPage("pageGame");

                debug("กำลังเปิดกล้อง...");

                await openCamera();

                debug("กำลังเปิด AI...");

                await setupPoseAI();

                debug("เริ่มเกม");

                startGame();

            } catch (err) {

                console.error(err);

                alert(err.message);

            }

        });

    //-------------------------
    // เล่นอีกครั้ง
    //-------------------------

    document
        .getElementById("btnPlayAgain")
        .addEventListener("click", () => {

            location.reload();

        });

}
