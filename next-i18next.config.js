const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localeDetection: false,
    localePath: path.resolve('./public/locales')
  }
};
