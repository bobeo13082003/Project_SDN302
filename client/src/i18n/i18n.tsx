import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import SIGNIN_EN from '../locales/en/signin.json'
import SIGNIN_VI from '../locales/vi/signin.json'
import SIGNUP_EN from '../locales/en/signup.json'
import SIGNUP_VI from '../locales/vi/signup.json'
import HEADER_EN from '../locales/en/header.json'
import HEADER_VI from '../locales/vi/header.json'
import HOME_EN from '../locales/en/home.json'
import HOME_VI from '../locales/vi/home.json'
import SIDER_EN from '../locales/en/sider.json'
import SIDER_VI from '../locales/vi/sider.json'
import LEARNQUIZ_EN from '../locales/en/LearnQuiz.json';
import LEARNQUIZ_VI from '../locales/vi/LearnQuiz.json';
import TUTORIAL_EN from '../locales/en/tutorial.json';
import TUTORIAL_VI from '../locales/vi/tutorial.json'

export const locales = {
    en: "English",
    vi: "Tiếng Việt"
}

export const resources = {
    en: {
        signin: SIGNIN_EN,
        signup: SIGNUP_EN,
        header: HEADER_EN,
        home: HOME_EN,
        sider: SIDER_EN,
        learnquiz: LEARNQUIZ_EN,
        tutorial:TUTORIAL_EN
    },
    vi: {
        signin: SIGNIN_VI,
        signup: SIGNUP_VI,
        header: HEADER_VI,
        home: HOME_VI,
        sider: SIDER_VI,
learnquiz: LEARNQUIZ_VI,
         tutorial:TUTORIAL_VI

    }
};

export const defaultNS = 'signin';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",
        fallbackLng: 'en',
        ns: ['signin', 'signup', 'header', 'home', 'sider', 'learnquiz'],
        defaultNS,
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;