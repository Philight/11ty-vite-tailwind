import type { Config } from 'tailwindcss';

import * as fs from 'fs';
import plugin from 'tailwindcss/plugin';
import daisyui from 'daisyui';

import { BREAKPOINTS } from './src/_data/BREAKPOINTS';
import './utils/prototype';
import { getPathnames } from './utils/pathname';

// =========================================================================

const __dirname = getPathnames(import.meta.url).__dirname;
const CSSVariablesPath = __dirname + '/src/assets/css/configurable/variables.css';

const CSSVariables = fs.readFileSync(CSSVariablesPath, { encoding: 'utf8', flag: 'r' });
const CSSRules = CSSVariables.split(/\r?\n/);

const PROPERTY_MODIFIERS = {
  color: '--color-',
  fontFamily: '--font-family-',
  boxShadow: '--box-shadow-',
};

const PROPERTY_FORMAT = {
  color: propertyRule => `rgba(var(${propertyRule}) / <alpha-value>)`,
  fontFamily: propertyRule => `var(${propertyRule})`,
  boxShadow: propertyRule => `var(${propertyRule})`,
};

const PROPERTY_SETTINGS = {};

// =========================================================================

function readCSS() {
  for (const property of Object.keys(PROPERTY_MODIFIERS)) {
    const modifier = PROPERTY_MODIFIERS[property];

    PROPERTY_SETTINGS[property] = CSSRules.filter(line => line.includes(modifier)).reduce((acc, line) => {
      const propertyRule = String(line.split(':')[0]).removeWhitespace();
      const propertyName = propertyRule.split(modifier)[1];
      return {
        ...acc,
        [propertyName]: PROPERTY_FORMAT[property](propertyRule),
      };
    }, {});
  }

  // console.log(PROPERTY_SETTINGS);
}

/* Converts HEX color to RGB */
function toRGB(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b].join(' ');
}

readCSS();

// =========================================================================

export default {
  mode: 'jit',
  /* Disable global resets  */
  corePlugins: {
    preflight: false,
  },
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: ['light', 'dark', 'halloween'], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root', // The element that receives theme color CSS variables
  },
  content: ['./src/**/*.{html,md,njk,ejs,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // BASE
        // red: 'rgba(var(--color-red) / <alpha-value>)',
        // green: 'rgba(var(--color-green) / <alpha-value>)',
        // blue: 'rgba(var(--color-blue) / <alpha-value>)',
        // white: '#FFFFFF',
        // black: '#000000',
        // gray: 'rgba(var(--color-gray) / <alpha-value>)',
        // 'gray-light': 'rgba(var(--color-gray-light) / <alpha-value>)',
        // 'gray-dark': 'rgba(var(--color-gray-dark) / <alpha-value>)',
        // 'gray-darker': 'rgba(var(--color-gray-darker) / <alpha-value>)',

        // // PALETTE
        // 'blue-dark': 'rgba(var(--color-blue-dark) / <alpha-value>)',
        // 'blue-light': 'rgba(var(--color-blue-light) / <alpha-value>)',
        // 'blue-highlight': 'rgba(var(--color-blue-highlight) / <alpha-value>)',
        // 'blue-sky': 'rgba(var(--color-blue-sky) / <alpha-value>)',

        // // PRIMARY
        // 'white-primary': 'rgba(var(--color-white-primary) / <alpha-value>)',
        // 'black-primary': 'rgba(var(--color-black-primary) / <alpha-value>)',
        // 'blue-primary': 'rgba(var(--color-blue-primary) / <alpha-value>)',
        // 'red-primary': 'rgba(var(--color-red-primary) / <alpha-value>)',
        // primary: 'rgba(var(--color-primary) / <alpha-value>)',
        // secondary: 'rgba(var(--color-secondary) / <alpha-value>)',
        // tertiary: 'rgba(var(--color-tertiary) / <alpha-value>)',
        // 'button-outline': 'var(--color-gray-lighter)',

        // ...readCSS('color'),
        ...(PROPERTY_SETTINGS.hasOwnProperty('color') && PROPERTY_SETTINGS.color),
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        'sm-max': { max: '48em' },
        'sm-only': { min: '32em', max: '48em' },
        'md-only': { min: '48em', max: '64em' },
        'lg-only': { min: '64em', max: '80em' },
        'xl-only': { min: '80em', max: '96em' },
        '2xl-only': { min: '96em' },
        /* */
        'mob-lg': { min: BREAKPOINTS.MOBILE_LG.em + 'em' }, //  480px
        'tab-sm': { min: BREAKPOINTS.TABLET_SM.em + 'em' }, //  600px
        'tab-md': { min: BREAKPOINTS.TABLET_MD.em + 'em' }, //  768px
        'tab-lg': { min: BREAKPOINTS.TABLET_LG.em + 'em' }, //  900px
        'desk-sm': { min: BREAKPOINTS.DESKTOP_SM.em + 'em' }, //  1024px
        'desk-md': { min: BREAKPOINTS.DESKTOP_MD.em + 'em' }, //  1200px
        'desk-lg': { min: BREAKPOINTS.DESKTOP_LG.em + 'em' }, //  1440px
        'desk-xl': { min: BREAKPOINTS.DESKTOP_XL.em + 'em' }, //  1920px
      },
      spacing: {
        header: 'var(--header-height)',
        announcement: 'var(--announcement-height)',
        screen: 'var(--screen-height, 100vh)',
        'gutter-outer-x': 'var(--gutter-outer-x)',
        'gutter-outer-y': 'var(--gutter-outer-y)',
        '1/10': '10%',
        '1/2': '50%',
        '1/3': 'calc(100% / 3)',
        '2/3': 'calc(100% / 3 * 2)',
        '1/4': '25%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        full: '100%',
        'screen-1/10-x': '10vw',
        'screen-1/2-x': '50vw',
        'screen-1/3-x': 'calc(100vw / 3)',
        'screen-2/3-x': 'calc(100vw / 3 * 2)',
        'screen-1/4-x': '25vw',
        'screen-3/4-x': '75vw',
        'screen-1/5-x': '20vw',
        'screen-2/5-x': '40vw',
        'screen-3/5-x': '60vw',
        'screen-4/5-x': '80vw',
        'screen-full-x': '100vw',
        'screen-1/10-y': '10vh',
        'screen-1/2-y': '50vh',
        'screen-1/3-y': 'calc(100vh / 3)',
        'screen-2/3-y': 'calc(100vh / 3 * 2)',
        'screen-1/4-y': '25vh',
        'screen-3/4-y': '75vh',
        'screen-1/5-y': '20vh',
        'screen-2/5-y': '40vh',
        'screen-3/5-y': '60vh',
        'screen-4/5-y': '80vh',
        'screen-full-y': '100vh',
        7.5: '1.875rem',
        10.5: '2.625rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        34: '8.5rem',
        38: '9.5rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav': 'calc(var(--screen-height, 100vh) - var(--navigation-height))',
        'screen-1/2': '50vh',
        'screen-1/3': 'calc(100vh / 3)',
        'screen-2/3': 'calc(100vh / 3 * 2)',
        'screen-1/4': '25vh',
        'screen-3/4': '75vh',
        'screen-1/5': '20vh',
        'screen-2/5': '40vh',
        'screen-3/5': '60vh',
        'screen-4/5': '80vh',
      },
      width: {
        screen: '100vw',
        'screen-1/2': '50vw',
        'screen-1/3': 'calc(100vw / 3)',
        'screen-2/3': 'calc(100vw / 3 * 2)',
        'screen-1/4': '25vw',
        'screen-3/4': '75vw',
        'screen-1/5': '20vw',
        'screen-2/5': '40vw',
        'screen-3/5': '60vw',
        'screen-4/5': '80vw',
      },
      fontFamily: {
        heading: 'var(--font-family-heading)',
        subheading: 'var(--font-family-subheading)',
        body: 'var(--font-family-body)',
        btn: 'var(--font-family-btn)',
        highlight: 'var(--font-family-highlight)',

        // ...readCSS('fontFamily'),
        ...(PROPERTY_SETTINGS.hasOwnProperty('fontFamily') && PROPERTY_SETTINGS.fontFamily),
      },
      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        lead: ['var(--font-size-lead)', '1.333'],
        copy: ['var(--font-size-copy)', '1.5'],
        fine: ['var(--font-size-fine)', '1.333'],
        '5xs': ['0.5rem', '0.625rem'], // 8px / 10px
        '4xs': ['0.5625rem', '0.6875rem'], // 9px / 11px
        '3xs': ['0.625rem', '0.75rem'], // 10px / 12px
        '2xs': ['0.6875rem', '0.875rem'], // 11px
        'xs-plus': ['0.8125rem', '1.125rem'], // 13px
        'base-plus': ['1.0625rem', '1.625rem'], // 17px
        '3xl-minus': ['1.75rem', '2.125rem'], // 28px / 34px
        '3xl-plus': ['2rem', '2.375rem'], // 32px / 38px
        '4xl-plus': ['2.5rem', '1'], // 40px
        '5xl-minus': ['2.75rem', '1'], // 44px
      },
      fontWeight: {
        'body-weight': 'var(--font-body-weight)',
        'body-weight-bold': 'var(--font-body-weight-bold)',
        'heading-weight': 'var(--font-heading-weight)',
      },
      letterSpacing: {
        '1/2': '0.05em',
        1: '0.1em',
        2: '0.2em',
        3: '0.3em',
        4: '0.4em',
        5: '0.5em',
      },
      maxWidth: {
        'prose-narrow': '45ch',
        'prose-wide': '80ch',
        'screen-2xl': '1440px',
        'screen-3xl': '1536px',
        default: 'var(--max-width)',
      },
      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',
        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',
        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)',

        // ...readCSS('boxShadow'),
        ...(PROPERTY_SETTINGS.hasOwnProperty('boxShadow') && PROPERTY_SETTINGS.boxShadow),
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      blur: {
        xs: '2px',
      },
      gridTemplateRows: {
        12: 'repeat(12, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
      },
      gridRow: {
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',
        'span-19': 'span 19 / span 19',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
        110: '110',
        200: '200',
      },
    },
  },
  plugins: [
    // DaisyUI
    daisyui,
    //    plugin(function ({ addBase }) {
    plugin(function ({ matchUtilities, theme }) {
      /*
      addBase({
        ":root": {
//          "--clr-primary": toRGB(colors['white-primary']),
        },
      });
*/
      matchUtilities(
        {
          'text-shadow': value => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      );
      /*
      matchUtilities(
        {
          'translate-z': (value) => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }), // this is actual CSS
        },
        { values: theme('translate'), supportsNegativeValues: true }
      )
*/
    }),
  ],
} satisfies Config;
