/**
 * Ambient romance canvas: supports customizable page effects
 * (Floating Hearts, Sparkles & Stars, Falling Petals, Floating Balloons, None)
 */
let currentEffect = 'floating-hearts';
let animationFrameId = null;

export function setAmbientEffect(effect) {
  currentEffect = effect;
  localStorage.setItem('love_page_effect', effect);
}

export function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-hearts-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  currentEffect = localStorage.getItem('love_page_effect') || 'floating-hearts';

  let particles = [];
  const particleCount = 20;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.size = Math.random() * 12 + 10;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;

      if (currentEffect === 'petals') {
        // Petals fall downward
        this.y = initial ? Math.random() * height : -20;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
        this.color = Math.random() > 0.5 ? '#F472B6' : '#FB7185';
      } else {
        // Hearts, sparkles, balloons float upward
        this.y = initial ? Math.random() * height : height + 25;
        this.speedY = Math.random() * 0.7 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.5;

        if (currentEffect === 'sparkles') {
          this.color = Math.random() > 0.4 ? '#FBBF24' : '#FDE68A';
        } else if (currentEffect === 'balloons') {
          const balloonColors = ['#F43F5E', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
          this.color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
          this.size = Math.random() * 14 + 14;
        } else {
          // Floating hearts default
          this.color = Math.random() > 0.5 ? '#A78BFA' : '#F472B6';
        }
      }
    }

    update() {
      if (currentEffect === 'petals') {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02) * 0.6;
        this.rotation += this.rotSpeed;
        if (this.y > height + 30) this.reset();
      } else {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4;
        this.rotation += this.rotSpeed;
        if (this.y < -35) this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (currentEffect === 'petals') {
        // Cherry blossom petal
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.5, this.size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (currentEffect === 'sparkles') {
        // Twinkling 4-point star
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const r = this.size * 0.5;
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          ctx.lineTo(
            Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3),
            Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else if (currentEffect === 'balloons') {
        // Balloon shape with string
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.7, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        // Little knot & string
        ctx.beginPath();
        ctx.moveTo(-2, this.size);
        ctx.lineTo(2, this.size);
        ctx.lineTo(0, this.size + 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, this.size + 4);
        ctx.quadraticCurveTo(4, this.size + 14, -2, this.size + 24);
        ctx.stroke();
      } else {
        // Floating heart
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function reinitParticles() {
    particles = [];
    if (currentEffect !== 'none') {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
  }

  reinitParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (currentEffect !== 'none') {
      for (const p of particles) {
        p.update();
        p.draw();
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animate();

  window.addEventListener('love_effect_changed', () => {
    currentEffect = localStorage.getItem('love_page_effect') || 'floating-hearts';
    reinitParticles();
  });
}
