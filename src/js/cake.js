/**
 * Interactive Birthday Cake & Wish Blowout Modal (Images 1 & 2)
 * Supports customizable confetti explosions: cute icons, emoji showers, paper, and balloons
 */
import confetti from 'canvas-confetti';

export function initCake() {
  const makeWishBtn = document.getElementById('make-wish-btn');
  const makeWishText = document.getElementById('make-wish-text');
  const btnTitleAbove = document.getElementById('hero-btn-title-above');
  const btnLineUnder = document.getElementById('hero-btn-line-under');

  const cakeModal = document.getElementById('cake-modal');
  const closeCakeBtn = document.getElementById('close-cake-btn');
  const blowCandlesBtn = document.getElementById('blow-candles-btn');
  const wishSuccessMsg = document.getElementById('wish-success-msg');
  const flames = document.querySelectorAll('.flame');
  const candles = document.querySelectorAll('.candle');

  let areCandlesBlown = false;

  function loadWishSettings() {
    const btnText = localStorage.getItem('love_wish_btn_text') || 'Make a Wish!';
    const titleAbove = localStorage.getItem('love_wish_title_above');
    const lineUnder = localStorage.getItem('love_wish_line_under');

    if (makeWishText) makeWishText.textContent = btnText;

    if (btnTitleAbove) {
      if (titleAbove && titleAbove.trim()) {
        btnTitleAbove.textContent = titleAbove;
        btnTitleAbove.classList.remove('hidden');
      } else {
        btnTitleAbove.classList.add('hidden');
      }
    }

    if (btnLineUnder) {
      if (lineUnder && lineUnder.trim()) {
        btnLineUnder.textContent = lineUnder;
        btnLineUnder.classList.remove('hidden');
      } else {
        btnLineUnder.classList.add('hidden');
      }
    }
  }

  loadWishSettings();

  function openCakeModal() {
    if (!cakeModal) return;
    cakeModal.classList.remove('hidden');
    if (areCandlesBlown) {
      relightCandles();
    }
  }

  function closeCakeModal() {
    if (!cakeModal) return;
    cakeModal.classList.add('hidden');
  }

  function playWishChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Celestial chime chord (C5, E5, G5, B5, C6)
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.18, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.7);
      });
    } catch (e) {
      console.warn('AudioContext:', e);
    }
  }

  function triggerExplosion() {
    const confettiType = localStorage.getItem('love_confetti_type') || 'cute-icons';
    const emojiSet = localStorage.getItem('love_emoji_set') || 'hearts';

    if (confettiType === 'emoji') {
      let emojis = ['💕', '💖', '💘', '💓'];
      if (emojiSet === 'birthday') emojis = ['🎂', '🎉', '🎈', '✨'];
      if (emojiSet === 'stars') emojis = ['✨', '🌟', '💫', '⭐'];
      if (emojiSet === 'kisses') emojis = ['💋', '🥰', '😘', '🌹'];

      try {
        const shapes = emojis.map((emo) => confetti.shapeFromText({ text: emo, scalar: 2.2 }));
        confetti({
          shapes,
          scalar: 2.2,
          particleCount: 65,
          spread: 80,
          origin: { y: 0.65 }
        });
      } catch {
        // Fallback standard confetti
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.65 } });
      }
    } else if (confettiType === 'balloons') {
      try {
        const balloonShape = confetti.shapeFromText({ text: '🎈', scalar: 2.5 });
        confetti({
          shapes: [balloonShape],
          scalar: 2.5,
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.65 } });
      }
    } else if (confettiType === 'paper') {
      // Classic party streamer and square paper confetti
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.65 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8FB1', '#9333EA']
      });
    } else {
      // Cute icons (default: hearts, stars in theme colors)
      const count = 120;
      const defaults = { origin: { y: 0.7 } };

      confetti({ ...defaults, particleCount: 40, spread: 35, colors: ['#EC4899', '#F472B6'] });
      confetti({ ...defaults, particleCount: 35, spread: 65, colors: ['#8B5CF6', '#A78BFA'] });
      confetti({ ...defaults, particleCount: 45, spread: 100, colors: ['#FBBF24', '#34D399', '#F43F5E'] });
    }
  }

  function blowOutCandles() {
    if (areCandlesBlown) return;
    areCandlesBlown = true;

    flames.forEach((flame) => {
      flame.classList.add('extinguished');
    });

    playWishChime();
    triggerExplosion();

    if (wishSuccessMsg) {
      wishSuccessMsg.classList.remove('hidden');
    }

    if (blowCandlesBtn) {
      blowCandlesBtn.querySelector('span').textContent = '✨ Relight Candles';
    }
  }

  function relightCandles() {
    areCandlesBlown = false;
    flames.forEach((flame) => {
      flame.classList.remove('extinguished');
    });
    if (wishSuccessMsg) {
      wishSuccessMsg.classList.add('hidden');
    }
    if (blowCandlesBtn) {
      blowCandlesBtn.querySelector('span').textContent = '💨 Blow Out Candles!';
    }
  }

  makeWishBtn?.addEventListener('click', openCakeModal);
  closeCakeBtn?.addEventListener('click', closeCakeModal);

  blowCandlesBtn?.addEventListener('click', () => {
    if (areCandlesBlown) {
      relightCandles();
    } else {
      blowOutCandles();
    }
  });

  candles.forEach((candle) => {
    candle.addEventListener('click', () => {
      if (!areCandlesBlown) blowOutCandles();
    });
  });

  cakeModal?.addEventListener('click', (e) => {
    if (e.target === cakeModal) closeCakeModal();
  });

  window.addEventListener('love_content_updated', loadWishSettings);
}
