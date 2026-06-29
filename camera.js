let cameraStream = null;
let poseDetector = null;
let motionRunning = false;
let motionLock = false;

async function openCamera() {
  const video = document.getElementById("camera");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("อุปกรณ์นี้ไม่รองรับการเปิดกล้อง");
  }

  cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 960 },
      height: { ideal: 540 }
    },
    audio: false
  });

  video.srcObject = cameraStream;

  return new Promise(resolve => {
    video.onloadedmetadata = () => {
      video.play();
      resolve(true);
    };
  });
}

function closeCamera() {
  motionRunning = false;

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}

async function setupPoseAI() {
  const video = document.getElementById("camera");
  const canvas = document.getElementById("poseCanvas");
  const ctx = canvas.getContext("2d");

  poseDetector = new Pose({
    locateFile: file => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  poseDetector.setOptions({
    modelComplexity: 0,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  poseDetector.onResults(results => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      drawSimplePose(results.poseLandmarks, ctx, canvas);
      detectLeanMotion(results.poseLandmarks);
    }
  });

  motionRunning = true;

  async function loop() {
    if (!motionRunning) return;

    await poseDetector.send({ image: video });
    requestAnimationFrame(loop);
  }

  loop();
}

function drawSimplePose(landmarks, ctx, canvas) {
  const points = [0, 11, 12, 23, 24];

  ctx.fillStyle = "rgba(255,255,255,.95)";

  points.forEach(i => {
    const p = landmarks[i];
    if (!p) return;

    const x = canvas.width - (p.x * canvas.width);
    const y = p.y * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  });

  const nose = landmarks[0];

  if (nose) {
    const x = canvas.width - (nose.x * canvas.width);
    const y = nose.y * canvas.height;

    ctx.font = "44px sans-serif";
    ctx.fillText("😀", x - 22, y - 20);
  }
}

function detectLeanMotion(landmarks) {
  if (!canAnswer || motionLock) return;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return;

  const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
  const hipCenterX = (leftHip.x + rightHip.x) / 2;

  const lean = shoulderCenterX - hipCenterX;

  const leftBox = document.getElementById("leftBox");
  const rightBox = document.getElementById("rightBox");

  leftBox.classList.remove("active");
  rightBox.classList.remove("active");

  if (lean > 0.075) {
    leftBox.classList.add("active");
    motionChoose("left");
  } else if (lean < -0.075) {
    rightBox.classList.add("active");
    motionChoose("right");
  }
}

function motionChoose(side) {
  motionLock = true;
  chooseAnswer(side);

  setTimeout(() => {
    motionLock = false;
  }, 1200);
}
