import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../en/common.json';
import enComponent from '../en/component.json';
import vnCommon from '../vn/common.json';
import vnComponent from '../vn/component.json';

const resources = {
  en: { common: enCommon, component: enComponent },
  vn: { common: vnCommon, component: vnComponent },
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
