/**
 * Tambola Background Music Manager
 * 
 * Generates a pleasant, repeating Tambola-style melody using Web Audio API.
 * Provides play/pause/volume controls and ducks audio during voice announcements.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let intervalId: ReturnType<typeof setInterval> | null = null;

// Pentatonic scale notes (pleasant, Indian-inspired feel)
const NOTES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

// Melodies — simple patterns using note indices
const MELODY_PATTERNS = [
  [0, 2, 4, 5, 4, 2, 3, 1],
  [0, 3, 5, 4, 2, 3, 1, 0],
  [2, 4, 5, 7, 5, 4, 3, 2],
  [0, 1, 2, 3, 4, 3, 2, 1],
];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function getMasterGain(): GainNode {
  if (!masterGain) {
    const ctx = getAudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.15; // Low background volume
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

function playNote(frequency: number, startTime: number, duration: number) {
  const ctx = getAudioContext();
  const gain = getMasterGain();

  // Main tone (sine)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = frequency;

  // Soft harmonic (triangle at octave above, very quiet)
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = frequency * 2;

  // Envelope
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, startTime);
  envelope.gain.linearRampToValueAtTime(0.6, startTime + 0.05);
  envelope.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.02);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.value = 0.15;

  osc1.connect(envelope);
  osc2.connect(harmonicGain);
  harmonicGain.connect(envelope);
  envelope.connect(gain);

  osc1.start(startTime);
  osc1.stop(startTime + duration);
  osc2.start(startTime);
  osc2.stop(startTime + duration);
}

function playMelodyLoop() {
  const ctx = getAudioContext();
  const patternIdx = Math.floor(Math.random() * MELODY_PATTERNS.length);
  const pattern = MELODY_PATTERNS[patternIdx];

  const noteDuration = 0.35;
  const gap = 0.15;
  const now = ctx.currentTime;

  pattern.forEach((noteIdx, i) => {
    const startTime = now + i * (noteDuration + gap);
    playNote(NOTES[noteIdx], startTime, noteDuration);
  });
}

/**
 * Start background music
 */
export function startMusic() {
  if (isPlaying) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    isPlaying = true;
    playMelodyLoop();

    // Repeat melody every ~4 seconds
    intervalId = setInterval(() => {
      if (isPlaying) {
        playMelodyLoop();
      }
    }, 4000);
  } catch (e) {
    console.warn('Failed to start music:', e);
  }
}

/**
 * Stop background music
 */
export function stopMusic() {
  isPlaying = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Set music volume (0.0 to 1.0)
 */
export function setMusicVolume(volume: number) {
  const gain = getMasterGain();
  gain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), getAudioContext().currentTime, 0.1);
}

/**
 * Duck music volume for voice announcements, then restore
 */
export function duckForAnnouncement(durationMs: number = 3000) {
  setMusicVolume(0.03); // Very quiet during announcement
  setTimeout(() => {
    if (isPlaying) {
      setMusicVolume(0.15); // Restore
    }
  }, durationMs);
}

/**
 * Check if music is currently playing
 */
export function isMusicPlaying(): boolean {
  return isPlaying;
}
