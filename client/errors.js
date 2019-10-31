(function () {
  location.hotname === 'localhost' ||
  location.search === '?dev' ||
  Sentry.init({ dsn: 'https://fd0641cf472642298c8e681b3a632c9a@sentry.io/1801707' });
  
  window.errors = {
    audioFail(error, name) {
      if (error.message.includes('user didn\'t interact') ||
        error.message.includes('play method is not allowed by the user agent')) {
        return console.warn('Autoplay prevented');
      }

      Sentry.addBreadcrumb('Failed audio called: ' + name);
      Sentry.captureException(error)
    }
  }
})();
