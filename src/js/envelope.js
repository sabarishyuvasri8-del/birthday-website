/**
 * Interactive 3D Love Letter Envelope (Image 4 top)
 */
import confetti from 'canvas-confetti';

export function initEnvelope() {
  const envelope = document.getElementById('envelope');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const tapOpenBtn = document.getElementById('tap-open-btn');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const letterBodyText = document.getElementById('letter-body-text');
  const letterSalutation = document.getElementById('letter-salutation');
  const letterSignature = document.getElementById('letter-signature-text');

  function loadLetterContent() {
    let girlfriendName = localStorage.getItem('love_girlfriend_name');
    if (!girlfriendName || girlfriendName === 'My Love') {
      girlfriendName = 'Myy Love';
    }
    const customLetter = localStorage.getItem('love_custom_letter');
    const customSignature = localStorage.getItem('love_custom_signature');

    if (letterSalutation) {
      letterSalutation.textContent = `My Dearest ${girlfriendName},`;
    }

    if (customLetter && letterBodyText) {
      letterBodyText.textContent = customLetter;
    }

    if (customSignature && letterSignature) {
      letterSignature.innerHTML = `${customSignature.replace(/\n/g, '<br>')}`;
    }
  }

  loadLetterContent();

  function openEnvelope() {
    if (!envelope || envelope.classList.contains('open')) return;

    envelope.classList.add('open');

    // Sweet micro-confetti burst from envelope
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.65 },
      colors: ['#A78BFA', '#F472B6', '#FBCFE8', '#DDD6FE']
    });

    if (tapOpenBtn) {
      tapOpenBtn.querySelector('span').textContent = '✉ Letter Opened';
    }
  }

  function closeEnvelope(e) {
    if (e) e.stopPropagation();
    if (!envelope) return;

    envelope.classList.remove('open');
    if (tapOpenBtn) {
      tapOpenBtn.querySelector('span').textContent = '✉ Tap to open';
    }
  }

  waxSealBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  tapOpenBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (envelope?.classList.contains('open')) {
      closeEnvelope();
    } else {
      openEnvelope();
    }
  });

  envelope?.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
      openEnvelope();
    }
  });

  closeLetterBtn?.addEventListener('click', (e) => {
    closeEnvelope(e);
  });

  // Listen for storage changes from settings
  window.addEventListener('love_content_updated', loadLetterContent);
}
