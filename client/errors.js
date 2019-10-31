(function () {
  window.errors = {
    audioFail(error, name) {
      logs.textContent += error;
      if (error.message.includes('user didn\'t interact') ||
        error.message.includes('play method is not allowed by the user agent')) {
        return console.warn('Autoplay prevented');
      }

      Sentry.addBreadcrumb('Failed audio called: ' + name);
      Sentry.captureException(error)
    }
  }
})();
