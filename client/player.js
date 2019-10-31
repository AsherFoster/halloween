// Handles loading and starting the <Insert witty thing here>
(function () {
  window.DEBUG_INFO = {};
  let player;
  let ready = false;
  let muted = location.search === '?muted';

  const videoEl = document.getElementById('video');
  videoEl.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1&controls=0&origin=' + window.location.origin;

  window.onYouTubeIframeAPIReady = () => {
    console.log('YT API Ready');
    player = new YT.Player('video', {
      videoId: 'dQw4w9WgXcQ', // Take a guess
      playerVars: {controls: 0},
      events: {
        onReady: onPlayerReady,
      }
    });
  };

  function onPlayerReady() {
    console.log('Player ready', ready);
    if (muted) player.setVolume(0);
    player.playVideo();
    if (!ready) {
      setTimeout(() => {
        player.pauseVideo();
        player.seekTo(1, true);
      }, 100);
    } else {
      ready = true
    }
  }
  window.countdownComplete = () => {
    console.log('Countdown complete', ready);
    if (ready) player.playVideo();
    ready = true
  }
})();
//
// (async () => {
//   window.DEBUG_INFO = {};
//
//   let {debug: debugSetting, layoutMode: LAYOUT_MODE} = localStorage.getItem('eyes-settings') ?
//     JSON.parse(localStorage.getItem('eyes-settings')) :
//     {debug: false, layoutMode: 'big'};
//
//   const eyeColors = ['#a29bfe', '#74b9ff', '#ff7675', '#fab1a0', '#81ecec', '#55efc4'];
//   const maxDistanceFactor = 5;
//   const highlightOffsetFactor = 1/6;
//   const eyeElem = document.getElementById('eye');
//   const irisElem = document.getElementById('iris');
//   const pupilElem = document.getElementById('pupil');
//   const highlightElem = document.getElementById('highlight');
//   // const audio = new Audio('sound.mp3');
//
//   let height = 0;
//   let width = 0;
//   let eyeSize = 0;
//   let eyeColor = '';
//   let highlightOffset = 0;
//   let maxDistance = 100;
//   let shouldTryReplay = false;
//   let target = {x: 0, y: 0, z: 0};
//
//   window.DEBUG = debugSetting;
//
//   function layout() {
//     let docHeight = document.body.offsetHeight;
//     let docWidth = document.body.offsetWidth;
//     eyeColor = eyeColor || pickRandom(eyeColors);
//     eyeSize = Math.min(docWidth, docHeight) - 50;
//     console.log('Eye is', eyeSize);
//
//     highlightOffset = highlightOffsetFactor * eyeSize;
//
//     maxDistance = maxDistanceFactor  * eyeSize;
//
//     height = docHeight;
//     width = docWidth;
//
//     eyeElem.style.clipPath = 'circle(' + eyeSize/2 + 'px at center)';
//     eyeElem.style.height = eyeSize + 'px';
//     eyeElem.style.width = eyeSize + 'px';
//
//     irisElem.style.backgroundColor = eyeColor;
//   }
//
//   function updateEye() {
//     let eyeX = width/2;
//     let eyeY = height/2;
//     let deltaX = clamp(target.x - eyeX, -maxDistance, maxDistance);
//     let deltaY = clamp(target.y - eyeY, -maxDistance, maxDistance);
//
//     let distX = pythagoras(deltaX, target.z);
//     let distY = pythagoras(deltaY, target.z);
//     let ratioX = (eyeSize / 2.4) / distX;
//     let ratioY = (eyeSize / 2.4) / distY;
//
//     let offsetX = deltaX * ratioX;
//     let offsetY = deltaY * ratioY;
//
//     irisElem.style.transform = `translate(${round(offsetX, 3)}px, ${round(offsetY, 3)}px)`;
//
//     pupilElem.style.transform = `translate(${round(offsetX * 1.2, 3)}px, ${round(offsetY * 1.2, 3)}px)`;
//
//     highlightElem.style.transform = `translate(${round(offsetX * 1.6 + highlightOffset, 3)}px, ${round(offsetY * 1.6 - highlightOffset, 3)}px`;
//   }
//
//
//   // Generic Utils
//   function pickRandom(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
//   }
//   function pythagoras(...numbers) {
//     return Math.sqrt(numbers.reduce((a, b) => a + b ** 2, 0))
//   }
//   function clamp(val, min, max) {
//     return Math.min(max, Math.max(min, val));
//   }
//   function round(val, dp) {
//     return Math.round(val * (10 ** dp)) / (10 ** dp);
//   }
//
//   // Render fns
//   function renderDebug() {
//     `Dest: ${Math.round(app.target.x)}, ${Math.round(app.target.y)}, ${Math.round(app.target.z)}
//     Document: ${width} x ${height}
//     DPI: ${DEBUG_INFO.dpi} (${DEBUG_INFO.ppm}px/m), display is ${DEBUG_INFO.ppm * width / 100}cm wide
//     FOV: ${DEBUG_INFO.fov} degrees
//     Using device config: ${DEBUG_INFO.configName}
//     FPS: ${Math.round(1 / ((performance.now() - lastRender) / 1000))} (${performance.now() - renderStart}ms)
//     Detection time: ${DEBUG_INFO.detectionTime}ms
//     Targeting Mode: ${DEBUG_INFO.targetMode}`
//         .split('\n').forEach((l, i) => {
//       ctx.fillText(l.trim(), 10, 400 + (i + 1) * 20)
//     })
//   }
//   async function playAudio() {
//     playYoutube();
//   }
//
//   layout();
//
//   document.body.onclick = () => {
//     playYoutube();
//   };
//
//
//   window.addEventListener('resize', layout);
//   window.countdownComplete = () => {
//     console.log('Countdown complete! Playing!');
//     playAudio().catch(() => shouldTryReplay = true);
//   };
//   window.onDetectorUpdate = (point) => {
//     target = point;
//     updateEye();
//   }
// })();
