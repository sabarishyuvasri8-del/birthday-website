/**
 * Interactive Spin Wheel (Images 3 & 4)
 * High-definition Canvas rendering with customizable slices, one-tap presets & physics
 */
import confetti from 'canvas-confetti';

export function initWheel() {
  const canvas = document.getElementById('wheel-canvas');
  const spinBtn = document.getElementById('spin-btn');
  const spinBtnText = document.getElementById('spin-btn-text');
  const wheelTitle = document.getElementById('wheel-title');
  const wheelSubtitle = document.getElementById('wheel-subtitle');

  const winnerModal = document.getElementById('wheel-winner-modal');
  const winnerPrizeText = document.getElementById('winner-prize-text');
  const winnerPrizeDesc = document.getElementById('winner-prize-desc');
  const closeWinnerBtn = document.getElementById('close-winner-btn');
  const claimPrizeBtn = document.getElementById('claim-prize-btn');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const size = 340;
  canvas.width = size;
  canvas.height = size;
  const center = size / 2;
  const radius = center - 8;

  const defaultSlices = [
    { title: 'Surprise Dinner', color: '#FF6B6B', desc: 'A candlelit romantic dinner at your favorite dream spot! 🥂' },
    { title: 'Day Trip Together', color: '#4ECDC4', desc: 'A spontaneous road trip and scenic adventure together! 🚗' },
    { title: 'Breakfast in Bed', color: '#FFE66D', desc: 'Pancakes, fresh strawberries, warm coffee, and cozy morning cuddles! 🥞' },
    { title: 'Movie Marathon', color: '#7BC8A4', desc: 'Snuggle up under blankets and watch all your favorite comfort movies! 🎬' },
    { title: 'A Little Gift', color: '#FFAAA6', desc: 'A special sweet birthday present waiting just for you! 🎁' },
    { title: 'Dessert Date', color: '#FF8FB1', desc: 'Late-night ice cream, warm pastries, or any sweet treat you crave! 🍰' }
  ];

  let slices = [];
  let currentRotation = 0;
  let isSpinning = false;
  let hasWonOnce = false;

  function loadWheelSettings() {
    const title = localStorage.getItem('love_wheel_title') || 'Spin for Your Birthday Surprise';
    const subtitle = localStorage.getItem('love_wheel_subtitle') || '6 things could happen next';
    const btnText = localStorage.getItem('love_wheel_btn_text') || 'Spin the Wheel';

    if (wheelTitle) wheelTitle.textContent = title;
    if (wheelSubtitle) wheelSubtitle.textContent = subtitle;
    if (spinBtnText) spinBtnText.textContent = btnText;

    try {
      const stored = localStorage.getItem('love_wheel_slices');
      slices = stored ? JSON.parse(stored) : defaultSlices;
      if (!Array.isArray(slices) || slices.length < 2) {
        slices = defaultSlices;
      }
    } catch {
      slices = defaultSlices;
    }

    drawWheel(currentRotation);
  }

  function drawWheel(rotation) {
    ctx.clearRect(0, 0, size, size);
    const totalSlices = slices.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    // Draw slices
    for (let i = 0; i < totalSlices; i++) {
      const angle = rotation + i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + sliceAngle);
      ctx.fillStyle = slices[i].color;
      ctx.fill();

      // Subtle slice border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.stroke();

      // Slice Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 4;
      ctx.fillText(slices[i].title, radius - 20, 5);
      ctx.restore();
    }

    // Outer Bezel Rim with White Dots
    ctx.save();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#5B21B6';
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.stroke();

    const numDots = 24;
    for (let d = 0; d < numDots; d++) {
      const dotAngle = (2 * Math.PI / numDots) * d;
      const dotX = center + (radius - 3.5) * Math.cos(dotAngle);
      const dotY = center + (radius - 3.5) * Math.sin(dotAngle);

      ctx.beginPath();
      ctx.arc(dotX, dotY, 2.2, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }
    ctx.restore();
  }

  loadWheelSettings();

  function spin() {
    const allowRespin = localStorage.getItem('love_wheel_respin') !== 'false';
    if (hasWonOnce && !allowRespin) {
      alert('You have already claimed your birthday surprise! ♥');
      return;
    }

    if (isSpinning) return;
    isSpinning = true;
    if (spinBtn) spinBtn.disabled = true;

    const totalSlices = slices.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;
    const prizeIndex = Math.floor(Math.random() * totalSlices);

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const sliceCenterAngle = prizeIndex * sliceAngle + sliceAngle / 2;
    const targetOffset = (1.5 * Math.PI) - sliceCenterAngle;
    const finalAngle = extraSpins * (2 * Math.PI) + targetOffset;

    const startAngle = currentRotation % (2 * Math.PI);
    const totalRotationNeeded = finalAngle - startAngle;
    const duration = 4800;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      currentRotation = startAngle + totalRotationNeeded * easedProgress;
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        hasWonOnce = true;
        if (allowRespin && spinBtn) {
          spinBtn.disabled = false;
        }
        onSpinComplete(prizeIndex);
      }
    }

    requestAnimationFrame(animate);
  }

  function onSpinComplete(index) {
    const prize = slices[index];

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#6366F1']
    });

    if (winnerPrizeText) winnerPrizeText.textContent = prize.title;
    if (winnerPrizeDesc) winnerPrizeDesc.textContent = prize.desc || 'Enjoy your sweet surprise together! ♥';
    if (winnerModal) winnerModal.classList.remove('hidden');
  }

  spinBtn?.addEventListener('click', spin);
  canvas.addEventListener('click', spin);

  closeWinnerBtn?.addEventListener('click', () => {
    winnerModal?.classList.add('hidden');
  });

  claimPrizeBtn?.addEventListener('click', () => {
    winnerModal?.classList.add('hidden');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#EC4899', '#8B5CF6', '#F43F5E']
    });
  });

  winnerModal?.addEventListener('click', (e) => {
    if (e.target === winnerModal) winnerModal.classList.add('hidden');
  });

  window.addEventListener('love_content_updated', loadWheelSettings);
}
