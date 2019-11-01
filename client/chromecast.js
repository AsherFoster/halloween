// Handles interaction with chromecast frameworks
(function() {
  const context = cast.framework.CastReceiverContext.getInstance();
  context.addCustomMessageListener("urn:x-cast:com.lex.epic", onMessage);
  context.start();


  // function onMessage(msg) {
  //   if(msg.data.c === "kill") {
  //     context.stop();
  //   }
  //   if(msg.data.c === "play") {
  //     if(player !== null)
  //       player.playVideo();
  //   }
  //   if(msg.data.c === "playt") {
  //     if(player !== null)
  //       setTimeout(function() {
  //         player.playVideo();
  //       }, msg.data.t - new Date().getTime());
  //   }
  //   if(msg.data.c === "pause") {
  //     if(player !== null)
  //       player.pauseVideo();
  //   }
  //   if(msg.data.c === "loadv") {
  //     if(player === null)
  //       startYoutubePlayer();
  //     player.loadVideoById(msg.data.id, 0);
  //     player.pauseVideo();
  //   }
  //   if(msg.data.c === "load") {
  //     if(player !== null)
  //       stopYoutubePlayer();
  //     document.body.background = msg.data.url;
  //   }
  //   if(msg.data.c === "unload") {
  //     if(player !== null)
  //       stopYoutubePlayer();
  //     document.body.background = "";
  //   }
  //   if(msg.data.c === "seek") {
  //     if(player !== null)
  //       player.seekTo(msg.data.time)
  //   }
  //   if(msg.data.c === "marquee") {
  //     if(msg.data.text == "") {
  //       document.getElementById("scrollingText").style.background = "transparent";
  //       document.getElementById("scrollingText").innerHTML = "";
  //     } else {
  //       document.getElementById("scrollingText").style.background = "black";
  //       document.getElementById("scrollingText").innerHTML = msg.data.text;
  //     }
  //   }
  // }
  function onMessage(msg) {
    if(msg.data.c === "kill") {
      context.stop();
    }
    if(msg.data.c === "play") {
      if(player !== null)
        player.playVideo();
    }
    if(msg.data.c === "pause") {
      if(player !== null)
        player.pauseVideo();
    }
    if(msg.data.c === "loadv") {
      player.loadVideoById(msg.data.id, 0);
      player.pauseVideo();
    }
    if(msg.data.c === "seek") {
      if(player !== null)
        player.seekTo(msg.data.time)
    }
  }

  function sendMessage(msg) {
    context.getSenders().forEach(s => context.sendCustomMessage("urn:x-cast:com.lex.epic", s.id, msg));
  }
})();
