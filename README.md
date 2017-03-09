# Penny: Suspicious Activity Explorer

Web app for exploring suspicious activity in penny stocks.  Incorporates EDGAR, XBRL, message board, press release and tout data.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Data

Code to construct the Elasticsearch indices referenced by this app is contained in 

    https://github.com/gophronesis/ernest
    
## Installation

Assuming that your elasticsearch indexes are up and running:

* `git clone <repository-url>` this repository
* `cd penny-sae`
* `npm install`
* `bower install`

* `cd $PROJECT_ROOT/server/node`
* `npm install`

### Configuration

There are three configuration files.

UI configuration:
* `$EDITOR app/user-config/global-config.js`

Server configuration has two files:
* `$EDITOR server/node/global-config.js`
* `$EDITOR server/node/server-config.js`

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
