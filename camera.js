let cameraStream = null;

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
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}
