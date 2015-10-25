const STYLES = {
  bold: ['\x1B[1m',  '\x1B[22m'],
  italic: ['\x1B[3m',  '\x1B[23m'],
  underline: ['\x1B[4m',  '\x1B[24m'],
  inverse: ['\x1B[7m',  '\x1B[27m'],
  strikethrough : ['\x1B[9m',  '\x1B[29m'],

  // grayscale
  white: ['\x1B[37m', '\x1B[39m'],
  grey: ['\x1B[90m', '\x1B[39m'],
  black: ['\x1B[30m', '\x1B[39m'],

  // colors
  blue: ['\x1B[34m', '\x1B[39m'],
  cyan: ['\x1B[36m', '\x1B[39m'],
  green: ['\x1B[32m', '\x1B[39m'],
  magenta: ['\x1B[35m', '\x1B[39m'],
  red: ['\x1B[31m', '\x1B[39m'],
  yellow: ['\x1B[33m', '\x1B[39m'],
};

const TYPES = {
  info: 'green',
  warn: 'yellow',
  error: 'red bold',
};

let stylize = function (message, styles) {
  styles = styles.split(' ');

  for (let i = 0; i < styles.length; i++) {
    let style = STYLES[styles[i]];
    message = style[0] + message + style[1];
  }

  return message;
};

let appendZero = function (num) {
  return ('0' + num).slice(-2);
};

export default function log (type, message) {
  let now = new Date();
  let hh = appendZero(now.getHours());
  let mm = appendZero(now.getMinutes());
  let ss = appendZero(now.getSeconds());
  let prefix = '[app]';

  if (this && this.logPrefix) {
    prefix = `[${this.logPrefix}]`;
  }

  let dateTime = `${hh}:${mm}:${ss}`;
  message = `${prefix}: ${message}`;

  if (!process.browser) {
    dateTime = stylize(dateTime, 'grey');
    message = stylize(message, TYPES[type]);
  }

  console.log(`[${dateTime}] ${message}`);
}
