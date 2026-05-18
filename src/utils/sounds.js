let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, type, duration, gainVal, startTime, ac) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(gainVal, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playBuy() {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    tone(440, 'sine', 0.12, 0.25, t, ac);
    tone(660, 'sine', 0.12, 0.2, t + 0.1, ac);
  } catch {}
}

export function playSell() {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    tone(660, 'sine', 0.12, 0.25, t, ac);
    tone(880, 'sine', 0.15, 0.2, t + 0.1, ac);
  } catch {}
}

export function playEncounter() {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    // alternating wail
    for (let i = 0; i < 6; i++) {
      const freq = i % 2 === 0 ? 880 : 660;
      tone(freq, 'sawtooth', 0.18, 0.15, t + i * 0.18, ac);
    }
  } catch {}
}

export function playGameOver() {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    [440, 415, 392, 349].forEach((f, i) => tone(f, 'sine', 0.35, 0.2, t + i * 0.3, ac));
  } catch {}
}

export function playAchievement() {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', 0.2, 0.18, t + i * 0.1, ac));
  } catch {}
}
