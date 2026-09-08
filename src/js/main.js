/**
 * Main Application Bootstrap
 */
import { initAmbientCanvas } from './ambient.js';
import { initCounter } from './counter.js';
import { initWheel } from './wheel.js';
import { initEnvelope } from './envelope.js';
import { initCake } from './cake.js';
import { initMusic } from './music.js';
import { initCoupons } from './coupons.js';
import { initPhotos } from './photos.js';
import { initSettings } from './settings.js';
import { initReasons } from './reasons.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initAmbientCanvas();
  initSettings();
  initCounter();
  initCake();
  initPhotos();
  initReasons();
  initWheel();
  initEnvelope();
  initMusic();
  initCoupons();
  console.log('💖 Birthday Celebration Website initialized with love!');
});
