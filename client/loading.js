// This IIFE handles the loading screen. Calls window.countdownComplete after a bit, and hides itself
(function () {
  const isDev = window.location.search === '?dev';
  let liveTime = new Date(Date.now() + (isDev ? 15 : 120) * 1000); // Will be overwritten
  const pixelSize = 2;

  const loadingWrapper = document.getElementById('loading');
  const canvas = document.getElementById('canvas');
  const countdownEl = document.getElementById('countdown');
  const diagEl = document.getElementById('diagnostics');
  const ctx = canvas.getContext('2d', {alpha: false}); // Performance thing
  const audioCtx = new AudioContext();
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
    beep('sine', 1000, d || 300);
  }
  function beep(type, freq, time) {
    // create Oscillator node
    const oscillator = audioCtx.createOscillator();

    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), time);
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
    if (deltaMs < 5 * 1000 && !beepCountdown) {
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
    return (srvTime + latency) - Date.now();
  }
  async function updateGoLive() {
    await syncTime();
    const r = await fetch('https://asherfoster.com/kv/golive');
    const t = JSON.parse(await r.text());
    console.log(t, timeOffset);
    liveTime = new Date(t + timeOffset);
    DEBUG.LIVE_TIME = liveTime;
    updateDiagnostics();
  }

  window.addEventListener('resize', layout);
  intervals.push(setInterval(changeMarkers, 500));
  intervals.push(setInterval(updateCountdown, 0));
  intervals.push(setInterval(updateDiagnostics, 500));
  if (!isDev) updateGoLive();
  layout();
  render();
})();
