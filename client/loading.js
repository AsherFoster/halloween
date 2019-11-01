// This IIFE handles the loading screen. Calls window.countdownComplete after a bit, and hides itself
(function () {
  let DEBUG = window.DEBUG || {};
  const isDev = window.location.search === '?dev';
  let liveTime = new Date(Date.now() + (isDev ? 15 : 120) * 1000); // Will be overwritten
  const pixelSize = 4;

  const loadingWrapper = document.getElementById('loading');
  const canvas = document.getElementById('canvas');
  const countdownEl = document.getElementById('countdown');
  const diagEl = document.getElementById('diagnostics');
  const ctx = canvas.getContext('2d', {alpha: false}); // Performance thing
  const beepAudio = new Audio('beep.mp3');
  const neons = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FF00AC'
  ];
  const offsets = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  let height, width;
  let imageData, buff;
  // noinspection JSConsecutiveCommasInArrayLiteral
  let markers = [,,,,];
  let markerI = 0;
  let markerSize = 30;
  let intervals = [];
  let done = false;
  let beepCountdown = null;
  let tenSBeep = false;
  let diagnostics = {
    LIVE_TIME: liveTime
  };
  let timeOffset = 0;

  function countdownBeep(d) {
    beepAudio.play().catch(e => errors.audioFail(e, 'beep'));
    setTimeout(() => {
      beepAudio.pause();
      beepAudio.currentTime = 0;
    }, d | 200);
  }
  function updateCountdown() {
    const deltaMs = liveTime.getTime() - Date.now();
    diagnostics.DELTA = deltaMs;
    if (deltaMs < 0) {
      countdownEl.innerText = 'now';
      intervals.forEach(i => clearInterval(i));
      done = true;
      loadingWrapper.style.display = 'none';
      countdownComplete();
    } else if (deltaMs < 60 * 1000) {
      countdownEl.innerText = (Math.round(deltaMs / 10) / 100).toFixed(2) + 's';
    }
    if (deltaMs < 5 * 1000 && !beepCountdown && !done) {
      beepCountdown = setInterval(countdownBeep, 1000);
      countdownBeep();
      intervals.push(beepCountdown);
    } else if (deltaMs < 15 * 1000 && !tenSBeep) {
      tenSBeep = true;
      countdownBeep(2000);
    }
  }
  function updateDiagnostics() {
    diagEl.innerText = JSON.stringify(diagnostics).toUpperCase();
  }
  function layout() {
    height = canvas.height = Math.round(canvas.offsetHeight/pixelSize);
    width = canvas.width = Math.round(canvas.offsetWidth/pixelSize);
    imageData = ctx.createImageData(width, height);
    buff = new Uint32Array(imageData.data.buffer); // Get a 32 bit view...?
    diagnostics.DIM = width + 'x' + height
  }
  function changeMarkers() {
    markers[markerI] = neons[Math.floor(Math.random() * neons.length)];
    markerI = (markerI + 1) % markers.length;
  }

  // Rendering
  function drawNoise() {
    let len = buff.length - 1;
    while(len--) buff[len] = Math.random() < 0.5 ? 0 : -1>>0;
    ctx.putImageData(imageData, 0, 0);
  }
  function drawMarkers() {
    const centerX = width - markerSize * 2;
    const centerY = height - markerSize * 2;
    markers.forEach((color, i) => {
      const [offsetX, offsetY] = offsets[i];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.fillRect(centerX + (offsetX * markerSize/2), centerY + (offsetY * markerSize/2), markerSize, markerSize);
      ctx.fill();
    });
  }
  function render() {
    drawNoise();
    drawMarkers();
    if (!done) requestAnimationFrame(render);
  }
  async function syncTime() {
    const start = Date.now();
    const resp = await fetch('https://asherfoster.com/time');
    const srvTime = JSON.parse(await resp.text());
    const latency = (Date.now() - start)/2;
    timeOffset = (srvTime + latency) - Date.now();
    // If local clock is behind, this should be positive
    // If local clock is ahead, this is negative
    // This value should be added to the local time
    // Or subtracted from remote time
  }
  async function updateGoLive() {
    await syncTime();
    // Get golive time with a cachebuster
    const r = await fetch('https://asherfoster.com/kv/golive?' + Date.now());
    const t = JSON.parse(await r.text());
    liveTime = new Date(t - timeOffset);
    DEBUG.LIVE_TIME = liveTime;
    updateDiagnostics();
  }

  window.addEventListener('resize', layout);
  intervals.push(setInterval(changeMarkers, 500));
  intervals.push(setInterval(updateDiagnostics, 500));
  if (!isDev) updateGoLive();
  layout();
  render();
  // We want to make sure this is called after everything, just in case it's after golive
  setTimeout(() => intervals.push(setInterval(updateCountdown, 10)), 500);
})();
