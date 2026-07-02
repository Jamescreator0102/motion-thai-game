function playCorrectSound() {
  playTone(880, 0.12);
  setTimeout(() => playTone(1200, 0.12), 100);
}

function playWrongSound() {
  playTone(220, 0.18);
}

function playTone(frequency, duration) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.log("Audio not available", error);
  }
}
