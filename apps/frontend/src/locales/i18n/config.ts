import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../en/common.json';
import enComponent from '../en/component.json';
import enHome from '../en/home.json';
import enAbout from '../en/about.json';
import vnCommon from '../vn/common.json';
import vnComponent from '../vn/component.json';
import vnHome from '../vn/home.json';
import vnAbout from '../vn/about.json';

const resources = {
  en: { common: enCommon, component: enComponent, home: enHome, about: enAbout },
  vn: { common: vnCommon, component: vnComponent, home: vnHome, about: vnAbout },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  supportedLngs: ['en', 'vn'],
  lng: undefined,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
