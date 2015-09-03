import en from './en';


class Langs {
  constructor () {
    this.errorMessage = this.errorMessage.bind(this);
  }

  errorMessage (lang, code) {
    return this[lang].errors[code] || code;
  }
}

Langs.prototype.en = en;

export default new Langs()
