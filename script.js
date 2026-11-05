const song = document.querySelector('#song');
const musicButton = document.querySelector('.music-control');
const musicLabel = document.querySelector('.music-label');
const soundGate = document.querySelector('#soundGate');
let autoplayBlocked = false;

function syncMusicControl() {
  const playing = !song.paused;
  musicButton.classList.toggle('is-playing', playing);
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Pause song' : 'Play song');
  musicLabel.textContent = playing
    ? 'Our song is playing'
    : autoplayBlocked
      ? 'Tap once to play our song'
      : 'Play our song';
}

async function beginSongAutomatically() {
  try {
    song.volume = 0.5;
    await song.play();
    autoplayBlocked = false;
    sessionStorage.setItem('nainsiSongStarted', 'true');
  } catch (_) {
    // Audible autoplay is blocked in many browsers until the first tap.
    autoplayBlocked = true;
    soundGate.hidden = false;
  }
  syncMusicControl();
}

async function startSongFromGesture() {
  try {
    song.volume = 0.5;
    await song.play();
    autoplayBlocked = false;
    sessionStorage.setItem('nainsiSongStarted', 'true');
    soundGate.hidden = true;
  } catch (_) {
    autoplayBlocked = true;
  }
  syncMusicControl();
}

async function toggleMusic() {
  if (song.paused) {
    await startSongFromGesture();
  } else {
    song.pause();
  }
  syncMusicControl();
}

musicButton.addEventListener('click', toggleMusic);
soundGate.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  startSongFromGesture();
});
song.addEventListener('play', syncMusicControl);
song.addEventListener('pause', syncMusicControl);

// Start on arrival wherever the browser allows audible autoplay. Browsers that
// protect against it receive a clear one-tap fallback through the music button.
beginSongAutomatically();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
