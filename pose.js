let poseDetector = null;
let poseRunning = false;
let motionLocked = false;

async function setupPoseAI() {
  const video = document.getElementById("camera");
  const canvas = document.getElementById("poseCanvas");
  const ctx = canvas.getContext("2d");

  poseDetector = new Pose({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
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
      drawPosePoints(results.poseLandmarks, ctx, canvas);
      detectLean(results.poseLandmarks);
    }
  });

  poseRunning = true;
  runPoseLoop();
}

async function runPoseLoop() {
  if (!poseRunning || !poseDetector) return;

  const video = document.getElementById("camera");
  await poseDetector.send({ image: video });

  requestAnimationFrame(runPoseLoop);
}

function stopPoseAI() {
  poseRunning = false;
}

function drawPosePoints(landmarks, ctx, canvas) {
  const points = [0, 11, 12, 23, 24];

  ctx.fillStyle = "white";

  points.forEach(index => {
    const point = landmarks[index];
    if (!point) return;

    const x = canvas.width - point.x * canvas.width;
    const y = point.y * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  });
}

function detectLean(landmarks) {
  if (!gameState || !gameState.canAnswer || motionLocked) return;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return;

  const shoulderCenter = (leftShoulder.x + rightShoulder.x) / 2;
  const hipCenter = (leftHip.x + rightHip.x) / 2;
  const lean = shoulderCenter - hipCenter;

  if (lean > 0.075) {
    motionChoose("left");
  } else if (lean < -0.075) {
    motionChoose("right");
  }
}

function motionChoose(side) {
  motionLocked = true;

  chooseAnswer(side);

  setTimeout(() => {
    motionLocked = false;
  }, 1200);
}
