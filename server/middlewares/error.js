import _ from 'lodash';
import langs from 'config/langs';

// Returns HTTP error.
//
// res   - The Express Response as {Response}.
// error - The error as {mixed}.
// code  - The HTTP status code as {Number}.

export default function (res, error, code = 400)  {
  var lang = (res.locals || {}).lang || 'en';

  res.status(code).json({
    error: {
      code: error,
      message: langs.errorMessage(lang, error)
    }
  }).end();
}
