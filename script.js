/* =============================================
   HAPPY BIRTHDAY - HOÀI ANH | script.js
   Tất cả tính năng: Canvas FX, Nhạc nền, Thổi nến
   Microphone, Đếm ngày yêu, Lightbox kỷ niệm.
   ============================================= */

/* ---------------------------------------------
   0. CẤU HÌNH NGÀY KỶ NIỆM (TÙY CHỈNH TẠI ĐÂY)
   --------------------------------------------- */
// Thay đổi ngày bắt đầu yêu nhau theo định dạng: YYYY-MM-DD
const TOGETHER_START_DATE = new Date('2026-02-06T00:00:00');

/* ---------------------------------------------
   1. UNIFIED PARTICLE SYSTEM (CÁNH HOA + CONFETTI + PHÁO HOA)
   Hỗ trợ màn hình Retina High-DPI, 1 render loop duy nhất
   --------------------------------------------- */
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');
let dpr = window.devicePixelRatio || 1;
let width = window.innerWidth;
let height = window.innerHeight;

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- Arrays chứa hạt ---
const petals = [];
const confettis = [];
const fireworks = [];

// --- Petal Object ---
const petalEmojis = ['🌸', '🌺', '🍀', '🌹', '🌷','💐'];
function Petal() {
  this.reset = function () {
    this.x = Math.random() * width;
    this.y = -35;
    this.size = 13 + Math.random() * 14;
    this.speedY = 0.7 + Math.random() * 1.3;
    this.speedX = (Math.random() - 0.5) * 0.7;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.035;
    this.opacity = 0.4 + Math.random() * 0.5;
    this.emoji = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  };
  this.reset();
  this.y = Math.random() * height; // Rải đều khi mới tải trang
}

Petal.prototype.update = function () {
  this.y += this.speedY;
  this.x += this.speedX + Math.sin(this.y * 0.012) * 0.5;
  this.angle += this.spin;
  if (this.y > height + 40) this.reset();
};

Petal.prototype.draw = function (context) {
  context.save();
  context.globalAlpha = this.opacity;
  context.translate(this.x, this.y);
  context.rotate(this.angle);
  context.font = `${this.size}px serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(this.emoji, 0, 0);
  context.restore();
};

for (let i = 0; i < 28; i++) {
  petals.push(new Petal());
}

// --- Confetti Burst ---
function burstConfetti(originEl) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#f06292', '#c2185b', '#ff80ab', '#c9a84c', '#f0d080', '#ffffff', '#ff4081'];

  for (let i = 0; i < 28; i++) {
    const angle = (Math.PI * 2 / 28) * i + (Math.random() - 0.5) * 0.3;
    const speed = 2.5 + Math.random() * 5;
    confettis.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 5,
      alpha: 1,
      life: 55,
      decay: 1 / 55,
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.16; // gravity
        this.alpha -= this.decay;
        this.life--;
      },
      draw(c) {
        if (this.alpha <= 0) return;
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    });
  }
}

// --- Fireworks Burst ---
function launchFireworks() {
  const colors = [
    '#f06292', '#c2185b', '#ff80ab', '#c9a84c', '#f0d080',
    '#ffffff', '#ffb3c6', '#ffd700', '#ff4081', '#ff8a80'
  ];

  function createBurst(cx, cy) {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 / 60) * i + (Math.random() - 0.5) * 0.2;
      const speed = 1.5 + Math.random() * 5.5;
      fireworks.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        alpha: 1,
        life: 80,
        decay: 1 / 80,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.08;
          this.alpha -= this.decay;
          this.life--;
        },
        draw(c) {
          if (this.alpha <= 0) return;
          c.save();
          c.globalAlpha = Math.max(0, this.alpha);
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          c.fill();
          c.restore();
        }
      });
    }
  }

  // 4 đợt pháo nổ so le
  for (let b = 0; b < 4; b++) {
    setTimeout(() => {
      const cx = width * (0.2 + Math.random() * 0.6);
      const cy = height * (0.15 + Math.random() * 0.4);
      createBurst(cx, cy);
    }, b * 380);
  }
}

// --- 1 Render Loop Duy Nhất ---
function mainAnimationLoop() {
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  // 1. Cánh hoa rơi
  for (let i = 0; i < petals.length; i++) {
    petals[i].update();
    petals[i].draw(ctx);
  }

  // 2. Confetti
  for (let i = confettis.length - 1; i >= 0; i--) {
    confettis[i].update();
    confettis[i].draw(ctx);
    if (confettis[i].life <= 0) confettis.splice(i, 1);
  }

  // 3. Pháo hoa
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw(ctx);
    if (fireworks[i].life <= 0) fireworks.splice(i, 1);
  }

  ctx.restore();
  requestAnimationFrame(mainAnimationLoop);
}
mainAnimationLoop();

/* ---------------------------------------------
   2. TRÌNH PHÁT NHẠC LÃNG MẠN (BGM + MUSIC BOX FALLBACK)
   --------------------------------------------- */
class RomanticMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    // Giai điệu Canon lãng mạn (D Major / G Major)
    this.notes = [
      587.33, 739.99, 880.00, 1174.66,
      493.88, 587.33, 739.99, 987.77,
      440.00, 554.37, 659.25, 880.00,
      392.00, 493.88, 587.33, 783.99,
      440.00, 587.33, 739.99, 880.00,
      587.33, 659.25, 739.99, 880.00,
      659.25, 783.99, 880.00, 1174.66,
      880.00, 739.99, 659.25, 587.33
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBell(freq, timeOffset = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + timeOffset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // Envelope tiếng chuông celesta / hộp nhạc
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.00001, t + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.8);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    this.timer = setInterval(() => {
      if (!this.isPlaying) return;
      const note = this.notes[this.step % this.notes.length];
      this.playBell(note);
      if (this.step % 4 === 0) {
        this.playBell(note / 2); // Nốt bass trầm êm
      }
      this.step++;
    }, 450);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

const musicBox = new RomanticMusicBox();
const bgm = document.getElementById('bgm');
const musicPlayer = document.getElementById('music-player');
const musicTooltip = document.getElementById('music-tooltip');
const musicNotesContainer = document.getElementById('music-notes');
let isMusicPlaying = false;
let noteSpawnInterval = null;

function spawnFloatingNote() {
  if (!isMusicPlaying) return;
  const noteEl = document.createElement('span');
  const symbols = ['♪', '♫', '♩', '♬', '💕'];
  noteEl.className = 'floating-note';
  noteEl.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  noteEl.style.left = `${Math.random() * 20 - 10}px`;
  noteEl.style.top = `${Math.random() * 10}px`;
  musicNotesContainer.appendChild(noteEl);
  setTimeout(() => noteEl.remove(), 2000);
}

function startMusic() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  musicPlayer.classList.add('playing');
  if (musicTooltip) musicTooltip.classList.add('hidden');

  // Thử phát file mp3 nếu có, nếu lỗi sẽ tự động bật hộp nhạc Web Audio
  bgm.play().then(() => {
    // MP3 phát thành công
  }).catch(() => {
    musicBox.start();
  });

  if (!noteSpawnInterval) {
    noteSpawnInterval = setInterval(spawnFloatingNote, 600);
  }
}

function stopMusic() {
  if (!isMusicPlaying) return;
  isMusicPlaying = false;
  musicPlayer.classList.remove('playing');
  bgm.pause();
  musicBox.stop();
  if (noteSpawnInterval) {
    clearInterval(noteSpawnInterval);
    noteSpawnInterval = null;
  }
}

function toggleMusic() {
  if (isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}

musicPlayer.addEventListener('click', toggleMusic);

// Tự động bật nhạc khi người dùng tương tác lần đầu với trang web
function handleFirstInteraction() {
  if (!isMusicPlaying) {
    startMusic();
  }
  window.removeEventListener('click', handleFirstInteraction);
  window.removeEventListener('touchstart', handleFirstInteraction);
}
window.addEventListener('click', handleFirstInteraction, { once: true });
window.addEventListener('touchstart', handleFirstInteraction, { once: true });

/* ---------------------------------------------
   3. BỘ ĐẾM THỜI GIAN YÊU NHAU (LOVE DAYS COUNTER)
   --------------------------------------------- */
function updateLoveCounter() {
  const now = new Date();
  const diff = now - TOGETHER_START_DATE;

  if (diff < 0) {
    document.getElementById('count-days').textContent = '0';
    document.getElementById('count-hours').textContent = '00';
    document.getElementById('count-mins').textContent = '00';
    document.getElementById('count-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('count-days').textContent = days;
  document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('count-mins').textContent = String(minutes).padStart(2, '0');
  document.getElementById('count-secs').textContent = String(seconds).padStart(2, '0');
}
updateLoveCounter();
setInterval(updateLoveCounter, 1000);

/* ---------------------------------------------
   4. THƯ TÌNH & MỞ THƯ TƯƠNG TÁC
   --------------------------------------------- */
function openEnvelope() {
  const letterCard = document.getElementById('letter-card');
  const triggerBox = document.getElementById('envelope-trigger-box');
  if (letterCard) {
    letterCard.classList.add('visible');
    burstConfetti(triggerBox || letterCard);
    letterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (triggerBox) {
    triggerBox.style.display = 'none';
  }
}

(function initScrollReveal() {
  const letterCard = document.getElementById('letter-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const triggerBox = document.getElementById('envelope-trigger-box');
        if (triggerBox) triggerBox.style.display = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  if (letterCard) observer.observe(letterCard);
})();

/* ---------------------------------------------
   5. CLICK TRÁI TIM BÍ MẬT
   --------------------------------------------- */
function revealHeart(el, idx) {
  if (el.classList.contains('revealed')) return;
  el.classList.add('revealed');
  burstConfetti(el);
}

/* ---------------------------------------------
   6. BỘ SƯU TẬP KỶ NIỆM & LIGHTBOX POPUP
   --------------------------------------------- */
const memories = [
  {
    icon: '💑',
    title: 'Bức Ảnh Đầu Tiên',
    desc: 'Lần đầu tiên chụp ảnh cùng nhau =))) và vẫn chưa có lần thứ 2.'
  },
  {
    icon: '🌙',
    title: 'Cuộc Gọi Đầu Tiên',
    desc: 'Em không biết anh đã vui như thế nào khi em nói muốn nói chuyện với anh đâu. Anh siêu yêu emmmmm.'
  },
  {

    icon: '💖',
    title: 'Bé iu của tuiii',
    desc: 'Kỳ quan thứ 10 của thế giới.'
  },
  {
    icon: '🌸',
    title: 'Tết tết tết',
    desc: 'Trông em dịu dàng và duyên dáng vô cùng. Babi luôn là cô gái xinh đẹp nhất trong mắt anh.'
  },
  {
    icon: '🌷',
    title: 'Bó Hoa Đẹp Nhất Trên đời',
    desc: 'Vì em là người xinh đẹp nhất trên đờiiiiiii.'
  },

  {
    icon: '👑',
    title: 'My Queen',
    desc: 'Anh yêu nàng nhất trên đờiiiii.'
  }
];

let currentMemoryIndex = 0;
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxMedia = document.getElementById('lightbox-media');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxCounter = document.getElementById('lightbox-counter');

function openLightbox(index) {
  currentMemoryIndex = index;
  updateLightboxContent();
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== lightboxModal && !e.target.classList.contains('lightbox-close')) return;
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
}

function navLightbox(direction) {
  currentMemoryIndex = (currentMemoryIndex + direction + memories.length) % memories.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const item = memories[currentMemoryIndex];
  const galleryItems = document.querySelectorAll('.gallery-item');
  const targetItem = galleryItems[currentMemoryIndex];
  const existingImg = targetItem ? targetItem.querySelector('img') : null;

  if (existingImg && existingImg.getAttribute('src')) {
    lightboxMedia.innerHTML = `<img src="${existingImg.src}" alt="${item.title}" />`;
  } else {
    lightboxMedia.innerHTML = `
      <div class="lightbox-media-placeholder">
        <span class="lightbox-media-icon">${item.icon}</span>
      </div>
    `;
  }

  lightboxTitle.textContent = item.title;
  lightboxDesc.textContent = item.desc;
  lightboxCounter.textContent = `${currentMemoryIndex + 1} / ${memories.length}`;
}

window.addEventListener('keydown', (e) => {
  if (!lightboxModal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
});

/* ---------------------------------------------
   7. THỔI NẾN (NÚT BẤM & MICROPHONE THẬT)
   --------------------------------------------- */
let candlesBlown = false;

function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;

  const btn = document.getElementById('blow-btn');
  const micBtn = document.getElementById('mic-btn');
  const micStatus = document.getElementById('mic-status');

  btn.disabled = true;
  btn.textContent = '✨ Ước nguyện thành hiện thực!';
  if (micBtn) {
    micBtn.disabled = true;
    micBtn.classList.remove('listening');
  }
  if (micStatus) {
    micStatus.textContent = 'Nến đã được thổi tắt!';
  }

  // Tắt từng ngọn nến so le và thả khói nhẹ
  const flames = document.querySelectorAll('.flame');
  const candles = document.querySelectorAll('.candle');
  flames.forEach((flame, i) => {
    setTimeout(() => {
      flame.classList.add('out');
      if (candles[i]) candles[i].classList.add('blown');
    }, i * 220);
  });

  // Hiển thị lời chúc và bắn pháo hoa
  setTimeout(() => {
    const msg = document.getElementById('wish-message');
    msg.classList.add('show');
    launchFireworks();
  }, 800);
}

// Thổi nến bằng Micro
let micStream = null;
let isMicListening = false;

async function toggleMicBlow() {
  if (candlesBlown) return;

  const micBtn = document.getElementById('mic-btn');
  const micStatus = document.getElementById('mic-status');

  if (isMicListening) {
    stopMicListening();
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const micCtx = new AudioCtx();
    const analyser = micCtx.createAnalyser();
    const source = micCtx.createMediaStreamSource(micStream);
    analyser.fftSize = 512;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    isMicListening = true;
    micBtn.classList.add('listening');
    micStatus.textContent = '🎙️ Đang lắng nghe... Hãy ghé sát và THỔI VÀO MIC điện thoại!';

    let blowFrames = 0;

    function detectBlow() {
      if (candlesBlown || !isMicListening) {
        stopMicListening();
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      // Tiếng thổi tạo năng lượng cao ở các dải tần số thấp (0-200Hz)
      let lowSum = 0;
      for (let i = 0; i < 25; i++) {
        lowSum += dataArray[i];
      }
      const avgLow = lowSum / 25;

      if (avgLow > 75) {
        blowFrames++;
        if (blowFrames >= 4) { // Thổi liên tục trong khoảng ~150ms
          blowCandles();
          stopMicListening();
          return;
        }
      } else {
        blowFrames = Math.max(0, blowFrames - 1);
      }

      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  } catch (err) {
    console.warn("Không thể truy cập Microphone", err);
    micStatus.textContent = 'Nếu không được micro thì em bấm nút bên dưới nhé babi';
  }
}

function stopMicListening() {
  isMicListening = false;
  const micBtn = document.getElementById('mic-btn');
  if (micBtn) micBtn.classList.remove('listening');
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
}

/* ---------------------------------------------
   8. HIỆU ỨNG HIỂN THỊ KHI CUỘN TRANG
   --------------------------------------------- */
(function initGalleryReveal() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => observer.observe(item));
})();
