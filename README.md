# Batman [![Circle CI](https://circleci.com/gh/walkapp/batman.svg?style=shield&circle-token=e25fd27edaf936d31d0cf03d37325da2b7dc9afa)](https://circleci.com/gh/walkapp/batman)

Api server

![Batman](http://www.merchoid.com/wp-content/uploads/2015/01/batman.jpg)

## Rules
1. Symlinks are sacred. _Do not fuck with symlinks_, do not remove symlinks, do not rename symlinks. Better hide them in your editor so you don't see them at all.

2. Use system aliases when applicable. `require('../models/awesome')` is better than `require('app/client/models/awesome')`, but `require('app/client/models/awesome')` is better than `require('../../../../client/models/awesome')`.

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

## Running tests
Tests run with [mocha](http://visionmedia.github.io/mocha/) using [chai](http://chaijs.com) as an assertion library.

For development purposes it's recommended to have mocha installed globally:

  `sudo npm -g install mocha`

Then you can run tests like this:

  `env NODE_ENV=test mocha test/api/tests/*`

Otherwise you can run tests via cake to use local mocha installation:

  `gulp test`

And don't forget to try out different reporters:

  `env NODE_ENV=test mocha test/api/tests/* --reporter nyan`

## Writing tests
API tests are located in the `test/api/tests` folder. To add a new test to the suite create a new js file and write your stuff.

If you never used mocha or chai before, here are the docs for those: [mocha docs](http://visionmedia.github.io/mocha/), [chai bdd](http://chaijs.com/api/bdd/).

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
