export default function getUserLocale() {
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale) {
    return savedLocale;
  }

  const browserLocale = navigator.language.split('-')[0];

  const supportedLocales = ['vn', 'en', 'es', 'fr', 'de', 'zh', 'ja'];

  return supportedLocales.includes(browserLocale) ? browserLocale : 'en';
}
