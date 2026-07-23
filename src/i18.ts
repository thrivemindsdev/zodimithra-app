import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ml from './locales/ml.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import gu from './locales/gu.json';
import bn from './locales/bn.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,

        resources: {
            en: { translation: en },
            ml: { translation: ml },
            hi: { translation: hi },
            ta: { translation: ta },
            te: { translation: te },
            gu: { translation: gu },
            bn: { translation: bn },
        },

        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;