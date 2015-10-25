import _ from 'lodash';
import url from 'url';


const CORS_REGEXP = /(?:.*\.)?walk\.(?:dev|me)$/;
let allowedHeaders = [
  'Accept', 'Content-Type', 'X-Access-Token',
].join(', ');

export function dev (req, res, next) {
  let referer = req.get('referer');

  if (!referer) return next();

  let parsedUrl = url.parse(referer);

  if (CORS_REGEXP.test(parsedUrl.hostname)) {
    let origin = `${parsedUrl.protocol}//${parsedUrl.host}`;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', allowedHeaders);
  }

  if (req.method === 'OPTIONS') {
    res.end();
  } else {
    next();
  }
};
