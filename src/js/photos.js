/**
 * Photo Memories & Carousel Studio (Images 1 & 3)
 * Supports permanent default couple photos, Polaroid vs Clean frame styles,
 * custom section title, and photo manager
 */

export const defaultPhotos = [
  {
    src: './images/memory1.jpg',
    caption: 'My Favorite Smile ♥',
    date: 'Our Beautiful Days'
  },
  {
    src: './images/memory2.jpg',
    caption: 'Pure Love & Cuddles ♡',
    date: 'Sweetest Moments'
  },
  {
    src: './images/memory3.jpg',
    caption: 'Side by Side Forever 🌟',
    date: 'Always With You'
  },
  {
    src: './images/memory4.jpg',
    caption: 'Just Us Against the World 💖',
    date: 'Unforgettable Memories'
  }
];

export function getPhotos() {
  try {
    const stored = localStorage.getItem('love_photos_list');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading photos:', e);
  }
  return defaultPhotos;
}

export function initPhotos() {
  const sectionTitle = document.getElementById('photos-section-title');
  const dashedBox = document.getElementById('dashed-photo-box');
  const polaroidTrack = document.getElementById('polaroid-track');
  const fileInput = document.getElementById('photo-upload-input');
  const studioFileInput = document.getElementById('studio-file-input');
  const studioUploadZone = document.getElementById('studio-upload-zone');
  const studioPhotosPreview = document.getElementById('studio-photos-preview');

  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');

  function savePhotos(photos) {
    localStorage.setItem('love_photos_list', JSON.stringify(photos));
    renderGallery();
    renderStudioThumbs();
  }

  function loadSettings() {
    const customTitle = localStorage.getItem('love_photos_title') || 'Our Sweet Moments';
    const frameStyle = localStorage.getItem('love_photo_frame') || 'polaroid';

    if (sectionTitle) sectionTitle.textContent = customTitle;

    if (polaroidTrack) {
      if (frameStyle === 'clean') {
        polaroidTrack.classList.add('clean-frame');
      } else {
        polaroidTrack.classList.remove('clean-frame');
      }
    }
  }

  function renderGallery() {
    const photos = getPhotos();
    loadSettings();

    if (photos.length === 0) {
      if (dashedBox) dashedBox.classList.remove('hidden');
      if (polaroidTrack) polaroidTrack.classList.add('hidden');
      return;
    }

    if (dashedBox) dashedBox.classList.add('hidden');
    if (polaroidTrack) {
      polaroidTrack.classList.remove('hidden');
      polaroidTrack.innerHTML = '';

      photos.forEach((photo) => {
        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.innerHTML = `
          <div class="polaroid-img-wrap">
            <img src="${photo.src}" alt="${photo.caption || 'Memory'}" class="polaroid-img" loading="lazy">
          </div>
          <p class="polaroid-caption">${photo.caption || 'Sweet Memory'}</p>
          <span class="polaroid-date">${photo.date || 'Forever Moment'}</span>
        `;

        card.addEventListener('click', () => {
          openLightbox(photo);
        });

        polaroidTrack.appendChild(card);
      });

      // Add a mini "+ Add memory" card at the end
      const addMoreCard = document.createElement('div');
      addMoreCard.className = 'polaroid-card add-more-polaroid';
      addMoreCard.style.display = 'flex';
      addMoreCard.style.flexDirection = 'column';
      addMoreCard.style.alignItems = 'center';
      addMoreCard.style.justifyContent = 'center';
      addMoreCard.style.minHeight = '140px';
      addMoreCard.style.background = 'rgba(245, 238, 255, 0.7)';
      addMoreCard.style.border = '2px dashed var(--purple-light)';
      addMoreCard.innerHTML = `
        <span style="font-size: 1.8rem; color: var(--purple-primary);">+</span>
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--purple-primary); margin-top: 4px;">Add Memory</span>
      `;
      addMoreCard.addEventListener('click', () => {
        fileInput?.click();
      });
      polaroidTrack.appendChild(addMoreCard);
    }
  }

  function renderStudioThumbs() {
    if (!studioPhotosPreview) return;
    const photos = getPhotos();
    studioPhotosPreview.innerHTML = '';

    photos.forEach((photo, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumb-item';
      thumb.innerHTML = `
        <img src="${photo.src}" alt="Thumb">
        <button type="button" class="thumb-del-btn" data-idx="${idx}">×</button>
      `;

      thumb.querySelector('.thumb-del-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const updated = [...photos];
        updated.splice(idx, 1);
        savePhotos(updated);
      });

      studioPhotosPreview.appendChild(thumb);
    });
  }

  function handleFiles(files) {
    if (!files.length) return;
    const currentPhotos = [...getPhotos()];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentPhotos.push({
          src: event.target.result,
          caption: 'Special Moment With You ♥',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        savePhotos(currentPhotos);
      };
      reader.readAsDataURL(file);
    });
  }

  function openLightbox(photo) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = photo.src;
    if (lightboxCaption) lightboxCaption.textContent = photo.caption || 'Memory with you';
    lightbox.classList.remove('hidden');
  }

  closeLightboxBtn?.addEventListener('click', () => {
    lightbox?.classList.add('hidden');
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });

  fileInput?.addEventListener('change', (e) => {
    handleFiles(Array.from(e.target.files || []));
  });

  studioFileInput?.addEventListener('change', (e) => {
    handleFiles(Array.from(e.target.files || []));
  });

  studioUploadZone?.addEventListener('click', () => {
    studioFileInput?.click();
  });

  studioUploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    studioUploadZone.style.background = 'var(--purple-pale)';
  });

  studioUploadZone?.addEventListener('dragleave', () => {
    studioUploadZone.style.background = '';
  });

  studioUploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    studioUploadZone.style.background = '';
    handleFiles(Array.from(e.dataTransfer.files || []));
  });

  renderGallery();
  renderStudioThumbs();

  window.addEventListener('love_content_updated', () => {
    renderGallery();
    renderStudioThumbs();
  });
}
