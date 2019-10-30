(function () {
  window.onDetectorUpdate = window.onDetectorUpdate || (() => {});


  // stream: a image handled somewhere else
  // webcam: handle creating a webcam feed
  // mouse: just use the mouse
  let CONTROL_MODE = 'random';
  const humanFaceWidth = 0.17;
  const mouseDepth = 300;


  // Device profile
  const {fov: fovDeg, id: configId, dpi} = JSON.parse(localStorage.getItem('eyes-config')) || {fov: 50, id: 'unset', dpi: 80};
  const cameraFov = fovDeg * Math.PI / 180;
  // dpi -> dpcm
  // dpcm -> dpm
  const pixelsPerMeter = (dpi / 2.56) * 100;

  // Detector
  const streamElement = document.getElementById('stream');
  const detector = new faceapi.TinyFaceDetectorOptions({size: 416});
  let stream;
  let detectionTime = 0;


  const overlay = document.getElementById('overlay');
  let started = false;

  window.DEBUG_INFO = {
    ...DEBUG_INFO,
    dpi,
    ppm: pixelsPerMeter,
    fov: fovDeg,
    configName: configId
  };

  // Target sourcing
  async function initControl() {
    window.addEventListener('mousemove', mouseEvent);
    window.addEventListener('dragover', mouseEvent);
    window.addEventListener('touchstart', e => {
      mouseEvent(e.changedTouches[0])
    });
    window.addEventListener('touchmove', e => {
      mouseEvent(e.changedTouches[0])
    });
    if(streamElement) {
      streamElement.width = 0;
      overlay.style.display = 'none';
    }

    // Configure the webcam as stream source
    if (CONTROL_MODE === 'webcam') await initWebcam();

    if (CONTROL_MODE === 'webcam' || CONTROL_MODE === 'stream') await startDetect();

    if (CONTROL_MODE === 'random') moveTarget();

    DEBUG_INFO.targetMode = CONTROL_MODE;
  }
  async function initWebcam() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({video: true});
      console.log('Successfully obtained video stream')
    } catch (err) {
      console.log('Failed to get webcam, falling back to mouse', err);
      CONTROL_MODE = 'mouse';
    }
    streamElement.srcObject = stream;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets'),
      new Promise(((resolve) => streamElement.addEventListener('playing', () => resolve())))
    ]);
  }
  function startDetect() {
    if(started) console.error('Playing, but already started!');
    started = true;
    detect();
  }
  function mouseEvent(e) {
    if (CONTROL_MODE === 'mouse') {
      onDetectorUpdate({
        x: e.pageX,
        y: e.pageY,
        z: mouseDepth
      });
    }
  }
  function moveTarget() {
    const height = document.body.offsetHeight;
    const width = document.body.offsetWidth;
    let x = Math.random() * width; // Between -1w and 2w
    let y = Math.random() * height; // Between -1h and 2h
    let depth = height + Math.random() * height; // Somewhere between 1h and 2h

    onDetectorUpdate({x, y, z: depth});

    setTimeout(moveTarget, 5000 + Math.random() * 1000); // Between 5s and 15s
  }

  // Facial recognition!
  async function detect() {
    let detectStart = performance.now();
    const detection = await faceapi.detectSingleFace(streamElement, detector);
    if (detection) {
      // console.log(detection.box)
      let {box} = detection;
      let scale = streamElement.width / streamElement.videoWidth;
      overlay.style.top = box.y * scale + 'px';
      overlay.style.left = box.x * scale + 'px';
      overlay.style.height = box.height * scale + 'px';
      overlay.style.width = box.width * scale + 'px';
    }
    if (detection)
      transformDetection(detection);
    detectionTime = performance.now() - detectStart;
    setTimeout(detect, 1000);
  }
  function transformDetection({box, imageHeight, imageWidth}) {
    let boxY = box.y + box.height/2;
    let boxX = box.x + box.width/2;
    let boxCenteredX = -(boxX - imageWidth/2);
    let boxCenteredY = boxY - imageHeight/2;

    // Calculate depth
    let faceAngle = cameraFov / (imageWidth/box.width); // Width in radians
    let distance = humanFaceWidth / Math.tan(faceAngle); // distance in m
    let distancePx = distance * pixelsPerMeter;

    let fromCenterX = boxCenteredX * 4;
    let fromCenterY = boxCenteredY * 4;

    onDetectorUpdate({
      x: fromCenterX + width/2,
      y: fromCenterY,
      z: distancePx
    });
  }

  initControl();
})();
