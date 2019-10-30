(function () {
  window.errors = {
    audioFail(error, name) {
      if (error.message.includes('user didn\'t interact')) return console.warn('Autoplay prevented');

      Sentry.addBreadcrumb('Failed audio called: ' + name);
      Sentry.captureException(error)
    }
  }
})();
