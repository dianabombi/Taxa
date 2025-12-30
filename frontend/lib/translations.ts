import sk from '../locales/sk/common.json';
import en from '../locales/en/common.json';
import uk from '../locales/uk/common.json';
import ru from '../locales/ru/common.json';
import hu from '../locales/hu/common.json';

export const translations = {
    sk,
    en,
    uk,
    ru,
    hu
};

export type Language = 'sk' | 'en' | 'uk' | 'ru' | 'hu';
export type TranslationKey = string;
