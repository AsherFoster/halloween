// Handles loading and starting the <Insert witty thing here>
(function () {
  window.DEBUG_INFO = {};
  window.player = null;
  let ready = false;
  let muted = location.search === '?muted';

  // const videoEl = document.getElementById('video');
  window.onYouTubeIframeAPIReady = () => {

    console.log('YT API Ready');
    // player = new Vimeo.Player(videoEl, {controls: false});
    // player.playVideo = () => player.play();
    // player.pauseVideo = () => player.pause();
    // player.seekTo = (n) => player.setCurrentTime(n);
    // onPlayerReady();
    player = new YT.Player('video', {
      videoId: 'dQw4w9WgXcQ', // Take a guess
      events: {
        onReady: onPlayerReady,
      },
      playerVars: {
        controls: 0
      }
    });
    window.player = player;
  };

  function onPlayerReady() {
    console.log('Player ready', ready);
    if (muted) player.setVolume(0);
    if (!ready) { // Make it pause once it's buffered a little if we aren't playing
      // player.playVideo().then(() => {
      //
      // });
      setTimeout(() => {
        player.pauseVideo();
        player.seekTo(1, true);
      }, 500);
    } else {
      player.playVideo();
    }
  }
  window.countdownComplete = () => {
    console.log('Countdown complete', ready);
    // if (ready)
      player.playVideo();
    // ready = true
  }
})();
