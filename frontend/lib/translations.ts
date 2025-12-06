import sk from '../locales/sk/common.json';
import en from '../locales/en/common.json';
import uk from '../locales/uk/common.json';
import ru from '../locales/ru/common.json';

export const translations = {
    sk,
    en,
    uk,
    ru
};

export type Language = 'sk' | 'en' | 'uk' | 'ru';
export type TranslationKey = string;
