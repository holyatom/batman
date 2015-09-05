# Batman
Api server

![Batman](http://www.merchoid.com/wp-content/uploads/2015/01/batman.jpg)

## Rules
1. Symlinks are sacred. _Do not fuck with symlinks_, do not remove symlinks, do not rename symlinks. Better hide them in your editor so you don't see them at all.

2. Use system aliases when applicable. `require('../models/awesome')` is better than `require('app/client/models/awesome')`, but `require('app/client/models/awesome')` is better than `require('../../../../client/models/awesome')`.

3. Watch out for using implicit globals like $ and _. They exist only to make using plugins easier. If your code doesn't require underscore for example, and uses it, it will fail to run on the server.

## Setup

1. Install nodejs:

  It is recommended to install Node.js with OS native installer via [Nodejs.org website](http://nodejs.org/download/).

  If you prefer using Homebrew (`brew install node`) **DON'T**. NPM [cannot be installed with Homebrew](https://github.com/npm/npm/wiki/Installing-npm-with-Homebrew-on-OS%C2%A0X), so good luck with that.

  How to install v0.12 on Ubuntu: [github.com/nodesource/distributions/issues/63](https://github.com/nodesource/distributions/issues/63#issuecomment-74580073).

2. Install dependencies:

  `sudo npm install -g nodemon babel`

  and then

  `npm install`

3. Create symlinks

  `gulp symlink`

4. Edit your hosts:

  `echo "127.0.0.1 walk.dev" >> /private/etc/hosts` (MacOS)

  `echo "127.0.0.1 walk.dev" >> /etc/hosts` (Linux)

5. Start server:

  `gulp dev`

  and navigate your browser to [http://walk.dev:8080/api/status](http://walk.dev:8080/api/status)

5. ???

6. PROFIT


## Assets management:

It's easier if you install gulp globally: `sudo npm install -g gulp`.

Gulpfile already takes care of assets compilation for you. If you need to compile assets separately, use these commands.

Build assets for development once

`gulp js` `gulp css`

Build assets for development and watch for assets changes

`gulp watch`

### Sublime settings
If you use Sublime, here's a recommended config:
```json
{

  "folder_exclude_patterns":
  [
    ".git",
    "node_modules",
    "public/assets"
  ],
  "index_exclude_patterns":
  [
    ".git",
    "node_modules",
    "public/assets"
  ],
  "rulers":
  [
    90
  ],
  "ensure_newline_at_eof_on_save": true,
  "detect_indentation": false,
  "show_encoding": true,
  "show_line_endings": true,
  "tab_size": 2,
  "translate_tabs_to_spaces": true
}
```
