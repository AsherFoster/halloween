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
    if (!ready) { // Make it pause once it's buffered a little if we aren't playing
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
