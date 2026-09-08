/**
 * Reasons You Make My World Brighter (Image 2)
 * Supports dynamic customization of reasons, emojis, titles, notes, and badge
 * Micro-interactions: tap cards to reveal love heart bursts
 */
import confetti from 'canvas-confetti';

export const defaultReasons = [
  { emoji: '✨', title: 'The way you light up every room you enter', note: 'Your warmth is impossible not to feel.' },
  { emoji: '😍', title: 'Your laugh that I could listen to forever', note: "It's my absolute favorite sound." },
  { emoji: '💘', title: 'How thoughtful you are with everyone you love', note: 'You have the gentlest, purest soul.' },
  { emoji: '🌹', title: 'Your big dreams and even bigger heart', note: 'You inspire me to be better every day.' },
  { emoji: '🌟', title: 'The way you make ordinary days feel like adventures', note: 'Even grocery trips are sweet with you.' },
  { emoji: '☕', title: 'Our cozy late-night conversations and silly jokes', note: 'Hours fly by like seconds.' },
  { emoji: '💖', title: 'The peace I feel whenever you hold my hand', note: 'You are my safe space and home.' },
  { emoji: '👑', title: 'Just simply being the wonderful, irreplaceable you', note: "I wouldn't trade you for the entire world." }
];

export function getReasons() {
  try {
    const stored = localStorage.getItem('love_reasons_list');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading reasons from storage:', e);
  }
  return defaultReasons;
}

export function renderReasons() {
  const reasonsListEl = document.getElementById('reasons-list');
  const reasonsTitleEl = document.getElementById('reasons-title');
  const reasonsSubtitleEl = document.getElementById('reasons-subtitle');
  const reasonsBadgeEl = document.getElementById('reasons-badge');

  const customTitle = localStorage.getItem('love_reasons_title') || 'Reasons You Make My World Brighter';
  const customSubtitle = localStorage.getItem('love_reasons_subtitle') || 'A little list of all the things I adore about you';
  const reasons = getReasons();
  const customBadge = localStorage.getItem('love_reasons_badge') || `♥ ${reasons.length} REASONS`;

  if (reasonsTitleEl) reasonsTitleEl.textContent = customTitle;
  if (reasonsSubtitleEl) reasonsSubtitleEl.textContent = customSubtitle;
  if (reasonsBadgeEl) reasonsBadgeEl.textContent = customBadge;

  if (!reasonsListEl) return;

  reasonsListEl.innerHTML = '';

  reasons.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'reason-item';
    card.setAttribute('data-index', idx + 1);
    card.innerHTML = `
      <div class="washi-tape"></div>
      <div class="reason-icon-box">${item.emoji || '💖'}</div>
      <div class="reason-text-wrap">
        <p class="reason-text">${item.title}</p>
        ${item.note ? `<span class="reason-subnote">${item.note}</span>` : ''}
      </div>
      <div class="reason-badge">
        <span class="badge-num">${idx + 1}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      const rect = card.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 15,
        spread: 35,
        startVelocity: 15,
        origin: { x, y },
        colors: ['#A78BFA', '#F472B6', '#F43F5E'],
        ticks: 60
      });

      card.style.transform = 'scale(0.97)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });

    reasonsListEl.appendChild(card);
  });
}

export function initReasons() {
  renderReasons();
  window.addEventListener('love_content_updated', renderReasons);
}
