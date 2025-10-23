interface LocationData {
  country: string;
  countryCode: string;
  region?: string;
  currency?: string;
  city?: string;
}

interface LocaleMapping {
  locale: string;
  currency: string;
  countries: string[];
}

const localeMap: LocaleMapping[] = [
  { locale: 'vn', currency: 'VND', countries: ['VN', 'VNM'] },
  {
    locale: 'en',
    currency: 'USD',
    countries: [
      'US',
      'USA',
      'GB',
      'GBR',
      'AU',
      'AUS',
      'CA',
      'CAN',
      'NZ',
      'NZL',
    ],
  },
];

export async function getUserLocationFromIP(): Promise<string> {
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale) {
    return savedLocale;
  }

  try {
    let locationData: LocationData | null = null;

    try {
      const response = await fetch('http://ip-api.com/json/', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        locationData = await response.json();
      }
    } catch (error) {
      console.warn('Primary geolocation service failed:', error);
    }

    if (locationData && locationData.countryCode) {
      const countryCode = locationData.countryCode;

      const mapping = localeMap.find(m => m.countries.includes(countryCode));

      if (mapping) {
        const locale = mapping.locale;
        localStorage.setItem('preferred-locale', locale);
        localStorage.setItem('detected-country', countryCode);
        return locale;
      }
    }

    return getUserLocaleFromBrowser();
  } catch (error) {
    console.error('Error detecting user location:', error);
    return getUserLocaleFromBrowser();
  }
}

function getUserLocaleFromBrowser(): string {
  const browserLocale = navigator.language.split('-')[0];
  const supportedLocales = ['vn', 'en', 'es', 'fr', 'de', 'zh', 'ja'];

  const locale = supportedLocales.includes(browserLocale)
    ? browserLocale
    : 'en';
  localStorage.setItem('preferred-locale', locale);

  return locale;
}

export async function refreshLocation(): Promise<string> {
  localStorage.removeItem('preferred-locale');
  localStorage.removeItem('detected-country');
  return getUserLocationFromIP();
}

export default getUserLocationFromIP;
