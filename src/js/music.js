/**
 * Romantic Mixtape: "Love Story" by Indila
 * Supports both high-fidelity Web Audio API synth arrangement of Indila's "Love Story"
 * AND custom MP3 upload stored in browser IndexedDB!
 */

// Simple IndexedDB helper for audio files
const DB_NAME = 'LovePageAudioDB';
const STORE_NAME = 'audio_store';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveCustomAudio(file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(file, 'love_story_track');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadCustomAudio() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('love_story_track');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function initMusic() {
  const vinylDisc = document.getElementById('vinyl-disc');
  const stylusArm = document.getElementById('stylus-arm');
  const playBtn = document.getElementById('mixtape-play-btn');
  const playIcon = document.getElementById('play-icon');
  const playbackHint = document.getElementById('playback-hint');
  const equalizer = document.getElementById('equalizer');
  const navMusicBtn = document.getElementById('music-toggle-btn');
  const navMusicIcon = document.getElementById('music-icon');
  const audioElement = document.getElementById('mixtape-audio');
  const audioFileInput = document.getElementById('audio-file-input');

  let audioCtx = null;
  let isPlaying = false;
  let loopTimer = null;
  let customAudioBlob = null;
  let customAudioUrl = null;

  // Load custom audio if user previously uploaded one
  loadCustomAudio().then((blob) => {
    if (blob) {
      customAudioBlob = blob;
      customAudioUrl = URL.createObjectURL(blob);
      if (audioElement) {
        audioElement.src = customAudioUrl;
      }
      if (playbackHint) {
        playbackHint.textContent = 'Playing: Love Story (Custom MP3)';
      }
    }
  });

  // Handle new MP3 upload
  audioFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await saveCustomAudio(file);
    customAudioBlob = file;
    if (customAudioUrl) URL.revokeObjectURL(customAudioUrl);
    customAudioUrl = URL.createObjectURL(file);

    if (audioElement) {
      audioElement.src = customAudioUrl;
      if (isPlaying) {
        stopAudio();
        startAudio();
      }
    }

    if (playbackHint) {
      playbackHint.textContent = 'Loaded: Love Story by Indila ✓';
    }
  });

  /* --------------------------------------------------------------------------
     "Love Story" by Indila - Authentic Web Audio API Arrangement
     Key: F Minor | Tempo: ~138 BPM in 3/4 Waltz Time
     Chords: Fm -> Bbm -> Eb -> Ab -> Db -> Bbm -> C -> C7
  -------------------------------------------------------------------------- */

  // Note frequencies (Hz)
  const N = {
    // Bass & Chord tones
    Eb2: 77.78, F2: 87.31, Ab2: 103.83, Bb2: 116.54, C3: 130.81, Db3: 138.59, Eb3: 155.56,
    F3: 174.61, G3: 196.00, Ab3: 207.65, Bb3: 233.08, C4: 261.63, Db4: 277.18,
    Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, Bb4: 466.16,
    // Melody notes
    C5: 523.25, Db5: 554.37, Eb5: 622.25, F5: 698.46, G5: 783.99, Ab5: 830.61
  };

  const beatSec = 0.435; // ~138 BPM
  const barSec = beatSec * 3; // 1.305 seconds per bar

  // 8 Bars Chorus / Main Theme of "Love Story" by Indila
  const arrangement = [
    // Bar 0: Fm ("C'est une love...")
    {
      bass: N.F2,
      chords: [N.Ab3, N.C4, N.F4],
      melody: [
        { note: N.C5, time: 0, dur: beatSec * 1.5 },
        { note: N.C5, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.Bb4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.Ab4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 1: Bbm ("...story...")
    {
      bass: N.Bb2,
      chords: [N.F3, N.Bb3, N.Db4],
      melody: [
        { note: N.F4, time: 0, dur: beatSec * 1.2 },
        { note: N.G4, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.Ab4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.Bb4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 2: Eb
    {
      bass: N.Eb3,
      chords: [N.G3, N.Bb3, N.Eb4],
      melody: [
        { note: N.Bb4, time: 0, dur: beatSec * 1.5 },
        { note: N.Bb4, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.Ab4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.G4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 3: Ab
    {
      bass: N.Ab2,
      chords: [N.C4, N.Eb4, N.Ab4],
      melody: [
        { note: N.Eb4, time: 0, dur: beatSec * 1.2 },
        { note: N.F4, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.G4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.Ab4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 4: Db
    {
      bass: N.Db3,
      chords: [N.F3, N.Ab3, N.Db4],
      melody: [
        { note: N.Ab4, time: 0, dur: beatSec * 1.5 },
        { note: N.Ab4, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.G4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.F4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 5: Bbm
    {
      bass: N.Bb2,
      chords: [N.F3, N.Bb3, N.Db4],
      melody: [
        { note: N.Db4, time: 0, dur: beatSec * 1.2 },
        { note: N.Eb4, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.F4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.G4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 6: C
    {
      bass: N.C3,
      chords: [N.E3, N.G3, N.C4],
      melody: [
        { note: N.G4, time: 0, dur: beatSec * 1.5 },
        { note: N.G4, time: beatSec * 1.5, dur: beatSec * 0.5 },
        { note: N.F4, time: beatSec * 2, dur: beatSec * 0.5 },
        { note: N.E4, time: beatSec * 2.5, dur: beatSec * 0.5 }
      ]
    },
    // Bar 7: C7 ("...c'est une love story")
    {
      bass: N.C3,
      chords: [N.E3, N.Bb3, N.C4],
      melody: [
        { note: N.G4, time: 0, dur: beatSec * 1.0 },
        { note: N.Ab4, time: beatSec * 1.0, dur: beatSec * 0.5 },
        { note: N.Bb4, time: beatSec * 1.5, dur: beatSec * 0.8 },
        { note: N.C5, time: beatSec * 2.3, dur: beatSec * 0.7 }
      ]
    }
  ];

  let currentBarIndex = 0;

  // Sound Synthesizers:
  // 1. Warm Waltz Bass
  function playBass(freq, time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.24, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + beatSec * 2.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + beatSec * 2.3);
  }

  // 2. Chanson Accordion/Piano Waltz Chords on beats 2 & 3
  function playChordNote(freq, time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + beatSec * 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + beatSec * 0.9);
  }

  // 3. Singing Chanson Vocal/Lead Melody of Love Story
  function playLeadMelody(freq, time, dur) {
    if (!audioCtx) return;

    // Dual oscillator with subtle detune for vocal shimmer
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.002, time);

    // Subtle romantic vibrato
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(5.2, time);
    lfoGain.gain.setValueAtTime(freq * 0.008, time);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);
    lfo.start(time + 0.15);
    lfo.stop(time + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.20, time + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  function scheduleNextWaltzBar() {
    if (!isPlaying || !audioCtx) return;

    const bar = arrangement[currentBarIndex];
    const now = audioCtx.currentTime;

    // Beat 1: Bass note
    playBass(bar.bass, now);

    // Beats 2 & 3: Waltz chords (boom - chick - chick)
    bar.chords.forEach((chordFreq) => {
      playChordNote(chordFreq, now + beatSec);
      playChordNote(chordFreq, now + beatSec * 2);
    });

    // Melody notes for this bar
    bar.melody.forEach((m) => {
      playLeadMelody(m.note, now + m.time, m.dur);
    });

    currentBarIndex = (currentBarIndex + 1) % arrangement.length;
    loopTimer = setTimeout(scheduleNextWaltzBar, barSec * 1000);
  }

  function startAudio() {
    // If user loaded an audio file, play via HTML5 Audio element
    if (audioElement && audioElement.src && audioElement.src !== window.location.href) {
      audioElement.play().then(() => {
        isPlaying = true;
        updateUI(true);
      }).catch(() => {
        // Fallback to Web Audio synth
        startSynth();
      });
      return;
    }

    startSynth();
  }

  function startSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    updateUI(true);
    scheduleNextWaltzBar();
  }

  function stopAudio() {
    isPlaying = false;
    if (loopTimer) clearTimeout(loopTimer);

    if (audioElement && !audioElement.paused) {
      audioElement.pause();
    }

    updateUI(false);
  }

  function toggleAudio() {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  }

  function updateUI(playing) {
    if (playing) {
      vinylDisc?.classList.add('spinning');
      stylusArm?.classList.add('playing');
      equalizer?.classList.add('active');
      if (playIcon) playIcon.textContent = '⏸';
      if (playbackHint) playbackHint.textContent = 'Playing: Love Story (Indila) ♡';
      if (navMusicIcon) navMusicIcon.textContent = '🔊';
      if (navMusicBtn) navMusicBtn.classList.add('active');
    } else {
      vinylDisc?.classList.remove('spinning');
      stylusArm?.classList.remove('playing');
      equalizer?.classList.remove('active');
      if (playIcon) playIcon.textContent = '▶';
      if (playbackHint) playbackHint.textContent = 'Tap to play Love Story';
      if (navMusicIcon) navMusicIcon.textContent = '🎵';
      if (navMusicBtn) navMusicBtn.classList.remove('active');
    }
  }

  audioElement?.addEventListener('ended', () => {
    // Loop audio
    if (audioElement.src) {
      audioElement.currentTime = 0;
      audioElement.play();
    }
  });

  playBtn?.addEventListener('click', toggleAudio);
  navMusicBtn?.addEventListener('click', toggleAudio);
}
