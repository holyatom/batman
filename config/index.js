import _ from 'lodash';
import fs from 'fs';
import deepExtend from 'underscore-deep-extend';
import { contains } from 'libs/utils';


_.mixin({ deepExtend: deepExtend(_) });

let readConfigs = function (path = '') {
  let envConfPath = `${__dirname}/${path}${nodeEnv}.js`;
  let localConfPath = `${__dirname}/${path}local.js`;
  let confs = [require(`${__dirname}/${path}default.js`)];

  if (fs.existsSync(envConfPath)) confs.push(require(envConfPath));
  if (fs.existsSync(localConfPath)) confs.push(require(localConfPath));

  return confs;
};

let nodeEnv = process.env.NODE_ENV || 'development';

let defaults = {
  env: nodeEnv,
  debug: !contains(['staging', 'production'], nodeEnv),
};

let config = _.deepExtend(defaults, ...readConfigs());

export default config;
