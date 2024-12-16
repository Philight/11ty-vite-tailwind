import { DateTime } from 'luxon';
import { clsx, type ClassValue } from 'clsx';
import { twMerge, extendTailwindMerge } from 'tailwind-merge';

export default {
  // cn: function (...inputs: ClassValue[]) {
  cn: function (...inputs) {
    console.log('!!!! CN', inputs);
    return twMerge(clsx(inputs));
  },

  // componentVariants: function (params, page) {
  // componentVariants: function (...inputs: ClassValue[]) {
  componentVariants: function (...inputs: ClassValue[]) {
    console.log('!!!! componentVariants', inputs);
    // console.log('!!!! componentVariants', page);
    console.log('!!!! componentVariants page', this.page);
    console.log('!!!! componentVariants elventy', this.eleventy);
  },

  dateToFormat: function (date, format) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(String(format));
  },

  dateToISO: function (date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
      includeOffset: false,
      suppressMilliseconds: true,
    });
  },

  obfuscate: function (str) {
    const chars = [];
    for (var i = str.length - 1; i >= 0; i--) {
      chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return chars.join('');
  },

  filterTagList(tags) {
    return (tags || []).filter(tag => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1);
  },
};
