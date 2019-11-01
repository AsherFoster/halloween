// Handles loading and starting the <Insert witty thing here>
(function () {
  window.DEBUG_INFO = {};
  window.player = null;
  let ready = false;
  let muted = location.search === '?muted';

  // function onYouTubeIframeAPIReady() {
  //   player = new YT.Player('youtubePlayer', {
  //     height: '100%',
  //     width: '100%',
  //     videoId: "",
  //     events: {
  //       onReady: () => isReady()
  //     },
  //   });
  // }
  //
  // function stopYoutubePlayer() {
  //
  // }
  //
  // function isReady() {
  //
  // }
  // const videoEl = document.getElementById('video');
  window.onYouTubeIframeAPIReady = () => {

    console.log('YT API Ready');
    // player = new Vimeo.Player(videoEl, {controls: false});
    // player.playVideo = () => player.play();
    // player.pauseVideo = () => player.pause();
    // player.seekTo = (n) => player.setCurrentTime(n);
    // onPlayerReady();
    player = new YT.Player('video', {
      videoId: 'hRf8oUD68vs', // Take a guess
      height: '100%',
      width: '100%',
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
    player.playVideo();

    if (!ready) { // Make it pause once it's buffered a little if we aren't playing
      ready = true;
      setTimeout(() => {
        player.pauseVideo();
        player.seekTo(1, true);
      }, 1000);
    }
  }
  window.countdownComplete = () => {
    console.log('Countdown complete', ready);
    if (ready)
      player.playVideo();
    ready = true
  }
})();
