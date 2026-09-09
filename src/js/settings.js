/**
 * Full Customization Studio Manager (YourLovePage Editor)
 * Manages Design Themes, Page Effects, Header & Confetti, Reasons, Photo Frames, and Wheel Presets
 */
import { setAmbientEffect } from './ambient.js';
import { defaultReasons } from './reasons.js';

export function initSettings() {
  const settingsBtn = document.getElementById('settings-toggle-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const settingsForm = document.getElementById('settings-form');
  const resetBtn = document.getElementById('reset-defaults-btn');

  // Tab buttons & contents
  const studioTabs = document.querySelectorAll('.studio-tab');
  const tabContents = document.querySelectorAll('.studio-tab-content');

  // Design elements
  const paletteRadios = document.querySelectorAll('input[name="color-palette"]');
  const selectPageEffect = document.getElementById('select-page-effect');

  // Header & Confetti elements
  const inputHeaderTitle = document.getElementById('input-header-title');
  const inputHeaderSubtitle = document.getElementById('input-header-subtitle');
  const inputWishBtnText = document.getElementById('input-wish-button-text');
  const inputWishTitleAbove = document.getElementById('input-wish-title-above');
  const inputWishLineUnder = document.getElementById('input-wish-line-under');
  const confettiRadios = document.querySelectorAll('input[name="confetti-type"]');
  const emojiSetGroup = document.getElementById('emoji-set-group');
  const selectEmojiSet = document.getElementById('select-emoji-set');

  // Reasons elements (Image 2)
  const inputReasonsTitle = document.getElementById('input-reasons-title');
  const inputReasonsSubtitle = document.getElementById('input-reasons-subtitle');
  const inputReasonsBadge = document.getElementById('input-reasons-badge');
  const studioReasonsListEl = document.getElementById('studio-reasons-list');
  const addReasonBtn = document.getElementById('add-reason-btn');
  const resetReasonsPresetBtn = document.getElementById('reset-reasons-preset-btn');
  let currentReasonsList = [];

  // Photos elements
  const inputPhotosTitle = document.getElementById('input-photos-title');
  const framePolaroidBtn = document.getElementById('frame-polaroid-btn');
  const frameCleanBtn = document.getElementById('frame-clean-btn');

  // Wheel elements
  const inputWheelTitle = document.getElementById('input-wheel-title');
  const inputWheelLineAbove = document.getElementById('input-wheel-line-above');
  const inputWheelBtnText = document.getElementById('input-wheel-button-text');
  const checkWheelRespin = document.getElementById('check-wheel-respin');
  const presetPills = document.querySelectorAll('.preset-pill');
  const prizesListEl = document.getElementById('prizes-list');
  const addPrizeBtn = document.getElementById('add-prize-btn');

  // Letter & Date elements
  const inputName = document.getElementById('input-girlfriend-name');
  const inputDate = document.getElementById('input-anniversary-date');
  const inputLetter = document.getElementById('input-letter-body');
  const inputSignature = document.getElementById('input-sender-signature');

  // Current working state for wheel prizes
  let currentWheelPrizes = [];

  const defaultWheelSlices = [
    { title: 'Surprise Dinner', color: '#FF6B6B', desc: 'A candlelit romantic dinner at your favorite dream spot! 🥂' },
    { title: 'Day Trip Together', color: '#4ECDC4', desc: 'A spontaneous road trip and scenic adventure together! 🚗' },
    { title: 'Breakfast in Bed', color: '#FFE66D', desc: 'Pancakes, fresh strawberries, warm coffee, and cozy morning cuddles! 🥞' },
    { title: 'Movie Marathon', color: '#7BC8A4', desc: 'Snuggle up under blankets and watch all your favorite comfort movies! 🎬' },
    { title: 'A Little Gift', color: '#FFAAA6', desc: 'A special sweet birthday present waiting just for you! 🎁' },
    { title: 'Dessert Date', color: '#FF8FB1', desc: 'Late-night ice cream, warm pastries, or any sweet treat you crave! 🍰' }
  ];

  // Presets definition (from Image 4)
  const presets = {
    datenight: [
      { title: 'Surprise Dinner', color: '#FF6B6B', desc: 'Romantic dinner at your favorite spot!' },
      { title: 'Stargazing Drive', color: '#4ECDC4', desc: 'Late night music and watching shooting stars.' },
      { title: 'Movie Marathon', color: '#FFE66D', desc: 'All your favorite movies with cozy blankets.' },
      { title: 'Sunset Picnic', color: '#7BC8A4', desc: 'Wine, strawberries, and sunset view.' },
      { title: 'Candlelit Dessert', color: '#FFAAA6', desc: 'Delicious pastries and sweet candles.' },
      { title: 'Cozy Cookoff', color: '#FF8FB1', desc: 'Cooking our favorite dinner together!' }
    ],
    littletreats: [
      { title: 'Breakfast in Bed', color: '#FFE66D', desc: 'Pancakes, coffee, and lazy morning cuddles!' },
      { title: 'A Little Gift', color: '#FFAAA6', desc: 'A sweet mystery present!' },
      { title: 'Dessert Date', color: '#FF8FB1', desc: 'Late night ice cream run.' },
      { title: 'Coffee On Me', color: '#4ECDC4', desc: 'Your favorite coffee drink.' },
      { title: 'Bakery Run', color: '#FF6B6B', desc: 'Warm fresh pastries.' },
      { title: 'Sweet Surprise', color: '#A78BFA', desc: 'A spontaneous treat!' }
    ],
    cheeky: [
      { title: 'Back Massage', color: '#FF6B6B', desc: 'A relaxing 20-minute massage.' },
      { title: '10-Min Cuddle', color: '#FF8FB1', desc: 'Uninterrupted cozy cuddles.' },
      { title: 'Foot Rub', color: '#FFE66D', desc: 'Soothing foot massage.' },
      { title: '1 Free Wish', color: '#A78BFA', desc: 'Whatever you ask for, I will do.' },
      { title: 'Unlimited Hugs', color: '#4ECDC4', desc: 'Hugs on demand all day long.' },
      { title: 'Kiss Attack', color: '#FFAAA6', desc: 'Shower of sweet kisses!' }
    ]
  };

  // Switch Tabs
  studioTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      studioTabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Apply Theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Load Saved Values into Studio Form
  function loadStudioValues() {
    // 1. Theme
    const savedTheme = localStorage.getItem('love_theme_palette') || 'lavender';
    paletteRadios.forEach((r) => {
      r.checked = r.value === savedTheme;
    });
    applyTheme(savedTheme);

    // 2. Page Effect
    const savedEffect = localStorage.getItem('love_page_effect') || 'floating-hearts';
    if (selectPageEffect) selectPageEffect.value = savedEffect;

    // 3. Header & Confetti
    let headerTitle = localStorage.getItem('love_header_title');
    if (!headerTitle || headerTitle === 'Happy Birthday, My Love') {
      headerTitle = 'Happy Birthday, My Babyy Girrll';
    }
    const headerSub = localStorage.getItem('love_header_subtitle') || 'Today we celebrate the most amazing person in my world 🎂';
    const wishBtnText = localStorage.getItem('love_wish_btn_text') || '🎂 Make a Wish! 🎂';
    const wishTitleAbove = localStorage.getItem('love_wish_title_above') ?? 'We will be forever together';
    const wishLineUnder = localStorage.getItem('love_wish_line_under') ?? 'I am so lucky to have you. You are my everything !!';
    const confettiType = localStorage.getItem('love_confetti_type') || 'cute-icons';
    const emojiSet = localStorage.getItem('love_emoji_set') || 'hearts';

    if (inputHeaderTitle) inputHeaderTitle.value = headerTitle;
    if (inputHeaderSubtitle) inputHeaderSubtitle.value = headerSub;
    if (inputWishBtnText) inputWishBtnText.value = wishBtnText;
    if (inputWishTitleAbove) inputWishTitleAbove.value = wishTitleAbove;
    if (inputWishLineUnder) inputWishLineUnder.value = wishLineUnder;

    confettiRadios.forEach((r) => {
      r.checked = r.value === confettiType;
    });
    if (selectEmojiSet) selectEmojiSet.value = emojiSet;
    toggleEmojiSetGroup(confettiType);

    // 4. Reasons Block
    const reasonsTitle = localStorage.getItem('love_reasons_title') || 'Reasons You Make My World Brighter';
    let reasonsSub = localStorage.getItem('love_reasons_subtitle');
    if (!reasonsSub || reasonsSub === 'A little list of all the things I adore about you') {
      reasonsSub = 'A little list of the things I adore about you';
    }
    let reasonsBadge = localStorage.getItem('love_reasons_badge');
    if (!reasonsBadge || reasonsBadge === '♥ 8 REASONS') {
      reasonsBadge = '♥ 7 REASONS';
    }

    if (inputReasonsTitle) inputReasonsTitle.value = reasonsTitle;
    if (inputReasonsSubtitle) inputReasonsSubtitle.value = reasonsSub;
    if (inputReasonsBadge) inputReasonsBadge.value = reasonsBadge;

    try {
      const storedReasons = localStorage.getItem('love_reasons_list');
      currentReasonsList = storedReasons ? JSON.parse(storedReasons) : JSON.parse(JSON.stringify(defaultReasons));
      if (!Array.isArray(currentReasonsList) || currentReasonsList.length === 0 || (currentReasonsList.length === 8 && currentReasonsList[0]?.title === 'The way you light up every room you enter')) {
        currentReasonsList = JSON.parse(JSON.stringify(defaultReasons));
      }
    } catch {
      currentReasonsList = JSON.parse(JSON.stringify(defaultReasons));
    }
    renderStudioReasonsList();

    // 5. Photos
    const photosTitle = localStorage.getItem('love_photos_title') || 'Our Sweet Moments';
    const photoFrame = localStorage.getItem('love_photo_frame') || 'polaroid';
    if (inputPhotosTitle) inputPhotosTitle.value = photosTitle;
    setFrameButtonState(photoFrame);

    // 6. Wheel
    const wheelTitle = localStorage.getItem('love_wheel_title') || 'Spin for Your Birthday Surprise';
    const wheelLineAbove = localStorage.getItem('love_wheel_line_above') || '6 things could happen next';
    const wheelBtnText = localStorage.getItem('love_wheel_btn_text') || 'Spin the Wheel';
    const wheelRespin = localStorage.getItem('love_wheel_respin') !== 'false';

    if (inputWheelTitle) inputWheelTitle.value = wheelTitle;
    if (inputWheelLineAbove) inputWheelLineAbove.value = wheelLineAbove;
    if (inputWheelBtnText) inputWheelBtnText.value = wheelBtnText;
    if (checkWheelRespin) checkWheelRespin.checked = wheelRespin;

    try {
      const storedSlices = localStorage.getItem('love_wheel_slices');
      currentWheelPrizes = storedSlices ? JSON.parse(storedSlices) : JSON.parse(JSON.stringify(defaultWheelSlices));
    } catch {
      currentWheelPrizes = JSON.parse(JSON.stringify(defaultWheelSlices));
    }
    renderPrizesList();

    // 7. Letter & Date
    let savedName = localStorage.getItem('love_girlfriend_name');
    if (!savedName || savedName === 'My Love') {
      savedName = 'Myy Love';
      localStorage.setItem('love_girlfriend_name', 'Myy Love');
    }
    let savedDate = localStorage.getItem('love_anniversary_date');
    if (!savedDate || savedDate === '2025-09-05') {
      savedDate = '2025-03-16';
      localStorage.setItem('love_anniversary_date', '2025-03-16');
    }
    const defaultLetter = `Happy Birthday to the most breathtaking girl in the entire universe! Every single day with you is filled with so much sunshine, laughter, and pure happiness. Thank you for loving me, inspiring me, and making my life so incredibly complete. I hope all your sweetest dreams come true this year!`;
    const savedLetter = localStorage.getItem('love_custom_letter') || defaultLetter;
    const savedSignature = localStorage.getItem('love_custom_signature') || 'Forever & Always Yours,\nWith all my love ♡';

    if (inputName) inputName.value = savedName;
    if (inputDate) inputDate.value = savedDate;
    if (inputLetter) inputLetter.value = savedLetter;
    if (inputSignature) inputSignature.value = savedSignature;
  }

  function toggleEmojiSetGroup(type) {
    if (emojiSetGroup) {
      if (type === 'emoji') {
        emojiSetGroup.classList.remove('hidden');
      } else {
        emojiSetGroup.classList.add('hidden');
      }
    }
  }

  function setFrameButtonState(frame) {
    if (frame === 'clean') {
      frameCleanBtn?.classList.add('active');
      framePolaroidBtn?.classList.remove('active');
    } else {
      framePolaroidBtn?.classList.add('active');
      frameCleanBtn?.classList.remove('active');
    }
  }

  // Render Dynamic Reasons List in Studio
  function renderStudioReasonsList() {
    if (!studioReasonsListEl) return;
    studioReasonsListEl.innerHTML = '';

    currentReasonsList.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'studio-reason-row';
      row.innerHTML = `
        <div class="reason-row-top">
          <input type="text" class="reason-emoji-input" value="${item.emoji || '💖'}" maxlength="4" title="Change Emoji">
          <span class="reason-num-badge">Reason #${idx + 1}</span>
          <button type="button" class="reason-del-btn" data-idx="${idx}" title="Delete Reason">🗑</button>
        </div>
        <div class="reason-inputs-col">
          <input type="text" class="reason-title-input" value="${item.title || ''}" placeholder="The reason you love her...">
          <input type="text" class="reason-subnote-input" value="${item.note || ''}" placeholder="Optional little note or memory...">
        </div>
      `;

      // Emoji input
      row.querySelector('.reason-emoji-input')?.addEventListener('input', (e) => {
        currentReasonsList[idx].emoji = e.target.value.trim() || '💖';
      });

      // Title input
      row.querySelector('.reason-title-input')?.addEventListener('input', (e) => {
        currentReasonsList[idx].title = e.target.value;
      });

      // Subnote input
      row.querySelector('.reason-subnote-input')?.addEventListener('input', (e) => {
        currentReasonsList[idx].note = e.target.value;
      });

      // Delete button
      row.querySelector('.reason-del-btn')?.addEventListener('click', () => {
        if (currentReasonsList.length <= 1) {
          alert('You need at least 1 reason card!');
          return;
        }
        currentReasonsList.splice(idx, 1);
        renderStudioReasonsList();
      });

      studioReasonsListEl.appendChild(row);
    });
  }

  // Add reason button click
  addReasonBtn?.addEventListener('click', () => {
    const emojis = ['✨', '😍', '💘', '🌹', '🌟', '☕', '💖', '👑', '🥰', '💫', '🧸', '💌'];
    const randomEmoji = emojis[currentReasonsList.length % emojis.length];
    currentReasonsList.push({
      emoji: randomEmoji,
      title: 'A sweet reason I adore you...',
      note: 'You make everything so special.'
    });
    renderStudioReasonsList();
  });

  // Reset reasons to default 8
  resetReasonsPresetBtn?.addEventListener('click', () => {
    currentReasonsList = JSON.parse(JSON.stringify(defaultReasons));
    if (inputReasonsBadge) inputReasonsBadge.value = '♥ 8 REASONS';
    renderStudioReasonsList();
  });

  // Render Dynamic Wheel Prize Rows
  function renderPrizesList() {
    if (!prizesListEl) return;
    prizesListEl.innerHTML = '';

    currentWheelPrizes.forEach((prize, idx) => {
      const row = document.createElement('div');
      row.className = 'prize-row';
      row.innerHTML = `
        <div class="prize-color-picker" style="background-color: ${prize.color};">
          <input type="color" value="${prize.color}" data-idx="${idx}">
        </div>
        <input type="text" class="prize-input" value="${prize.title}" data-idx="${idx}" placeholder="Prize Name">
        <button type="button" class="prize-del-btn" data-idx="${idx}" title="Delete prize">🗑</button>
      `;

      // Color picker change
      row.querySelector('input[type="color"]')?.addEventListener('input', (e) => {
        const newColor = e.target.value;
        currentWheelPrizes[idx].color = newColor;
        row.querySelector('.prize-color-picker').style.backgroundColor = newColor;
      });

      // Title input change
      row.querySelector('.prize-input')?.addEventListener('input', (e) => {
        currentWheelPrizes[idx].title = e.target.value;
      });

      // Delete prize row
      row.querySelector('.prize-del-btn')?.addEventListener('click', () => {
        if (currentWheelPrizes.length <= 2) {
          alert('The wheel needs at least 2 slices!');
          return;
        }
        currentWheelPrizes.splice(idx, 1);
        renderPrizesList();
      });

      prizesListEl.appendChild(row);
    });
  }

  // Preset Pills Click
  presetPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-preset');
      if (presets[key]) {
        currentWheelPrizes = JSON.parse(JSON.stringify(presets[key]));
        renderPrizesList();
      }
    });
  });

  // Add New Prize
  addPrizeBtn?.addEventListener('click', () => {
    const rainbow = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#7BC8A4', '#FFAAA6', '#FF8FB1', '#A78BFA'];
    const randomColor = rainbow[currentWheelPrizes.length % rainbow.length];
    currentWheelPrizes.push({
      title: 'Sweet Surprise',
      color: randomColor,
      desc: 'A delightful romantic surprise!'
    });
    renderPrizesList();
  });

  // Palette Live Change
  paletteRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        applyTheme(radio.value);
      }
    });
  });

  // Confetti Type Change
  confettiRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        toggleEmojiSetGroup(radio.value);
      }
    });
  });

  // Frame Toggle Click
  framePolaroidBtn?.addEventListener('click', () => {
    setFrameButtonState('polaroid');
  });

  frameCleanBtn?.addEventListener('click', () => {
    setFrameButtonState('clean');
  });

  // Open & Close Studio Modal
  settingsBtn?.addEventListener('click', () => {
    loadStudioValues();
    settingsModal?.classList.remove('hidden');
  });

  closeSettingsBtn?.addEventListener('click', () => {
    settingsModal?.classList.add('hidden');
  });

  settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add('hidden');
    }
  });

  // Save Changes
  settingsForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Theme
    const selectedPalette = document.querySelector('input[name="color-palette"]:checked')?.value || 'lavender';
    localStorage.setItem('love_theme_palette', selectedPalette);
    applyTheme(selectedPalette);

    // 2. Page Effect
    if (selectPageEffect) {
      setAmbientEffect(selectPageEffect.value);
      window.dispatchEvent(new CustomEvent('love_effect_changed'));
    }

    // 3. Header & Wish
    if (inputHeaderTitle) localStorage.setItem('love_header_title', inputHeaderTitle.value.trim());
    if (inputHeaderSubtitle) localStorage.setItem('love_header_subtitle', inputHeaderSubtitle.value.trim());
    if (inputWishBtnText) localStorage.setItem('love_wish_btn_text', inputWishBtnText.value.trim());
    if (inputWishTitleAbove) localStorage.setItem('love_wish_title_above', inputWishTitleAbove.value.trim());
    if (inputWishLineUnder) localStorage.setItem('love_wish_line_under', inputWishLineUnder.value.trim());

    const selectedConfetti = document.querySelector('input[name="confetti-type"]:checked')?.value || 'cute-icons';
    localStorage.setItem('love_confetti_type', selectedConfetti);
    if (selectEmojiSet) localStorage.setItem('love_emoji_set', selectEmojiSet.value);

    // 4. Reasons Block Save
    if (inputReasonsTitle) localStorage.setItem('love_reasons_title', inputReasonsTitle.value.trim());
    if (inputReasonsSubtitle) localStorage.setItem('love_reasons_subtitle', inputReasonsSubtitle.value.trim());
    if (inputReasonsBadge) localStorage.setItem('love_reasons_badge', inputReasonsBadge.value.trim());
    localStorage.setItem('love_reasons_list', JSON.stringify(currentReasonsList));

    // 5. Photos
    if (inputPhotosTitle) localStorage.setItem('love_photos_title', inputPhotosTitle.value.trim());
    const isClean = frameCleanBtn?.classList.contains('active');
    localStorage.setItem('love_photo_frame', isClean ? 'clean' : 'polaroid');

    // 6. Wheel
    if (inputWheelTitle) localStorage.setItem('love_wheel_title', inputWheelTitle.value.trim());
    if (inputWheelLineAbove) localStorage.setItem('love_wheel_line_above', inputWheelLineAbove.value.trim());
    if (inputWheelBtnText) localStorage.setItem('love_wheel_btn_text', inputWheelBtnText.value.trim());
    if (checkWheelRespin) localStorage.setItem('love_wheel_respin', checkWheelRespin.checked ? 'true' : 'false');
    localStorage.setItem('love_wheel_slices', JSON.stringify(currentWheelPrizes));

    // 7. Letter & Date
    const name = inputName.value.trim() || 'Myy Love';
    const date = inputDate.value || '2025-03-16';
    const letter = inputLetter.value.trim();
    const signature = inputSignature.value.trim();

    localStorage.setItem('love_girlfriend_name', name);
    localStorage.setItem('love_anniversary_date', date);
    if (letter) localStorage.setItem('love_custom_letter', letter);
    if (signature) localStorage.setItem('love_custom_signature', signature);

    // Update main page elements directly
    const heroTitle = document.getElementById('hero-title');
    const heroSub = document.getElementById('hero-subtitle');
    if (heroTitle) heroTitle.textContent = inputHeaderTitle ? inputHeaderTitle.value.trim() : 'Happy Birthday, My Babyy Girrll';
    if (heroSub && inputHeaderSubtitle) heroSub.textContent = inputHeaderSubtitle.value.trim();

    // Broadcast update to all modules
    window.dispatchEvent(new CustomEvent('love_content_updated'));

    settingsModal?.classList.add('hidden');
  });

  // Reset to Defaults
  resetBtn?.addEventListener('click', () => {
    if (confirm('Reset all details to default settings?')) {
      localStorage.clear();
      applyTheme('lavender');
      loadStudioValues();
      window.dispatchEvent(new CustomEvent('love_content_updated'));
      window.dispatchEvent(new CustomEvent('love_effect_changed'));
      window.location.reload();
    }
  });

  // Initial load
  loadStudioValues();
}
