import _ from 'lodash';
import langs from 'config/langs';
import { format } from 'libs/utils';

// Returns HTTP error.
//
// res   - The Express Response as {Response}.
// error - The error as {mixed}.
// code  - The HTTP status code as {Number}.

export default function (res, error, code = 400)  {
  var
    fields,
    lang = (res.locals || {}).lang || 'en';

  if (code !== 400) {
    return res.status(code).json({
      error: {
        code: error,
        message: langs.errorMessage(lang, error)
      }
    }).end();
  }

  fields = {};

  for (let key in error) {
    let code = error[key].message;

    fields[key] = {
      code: code,
      message: _.capitalize(format(langs.errorMessage(lang, code), key))
    }
  }

  res.status(code).json({
    error: {
      code: 'validation_failed',
      message: langs.errorMessage(lang, 'validation_failed'),
      fields: fields
    }
  }).end()
}
