# easy-puppeteer-html

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/easy-puppeteer-html.svg?style=flat-square
[npm-url]: https://npmjs.org/package/easy-puppeteer-html
[travis-image]: https://img.shields.io/travis/hubcarl/easy-puppeteer-html.svg?style=flat-square
[travis-url]: https://travis-ci.org/hubcarl/easy-puppeteer-html
[codecov-image]: https://img.shields.io/codecov/c/github/hubcarl/easy-puppeteer-html.svg?style=flat-square
[codecov-url]: https://codecov.io/github/hubcarl/easy-puppeteer-html?branch=master
[david-image]: https://img.shields.io/david/hubcarl/easy-puppeteer-html.svg?style=flat-square
[david-url]: https://david-dm.org/hubcarl/easy-puppeteer-html
[snyk-image]: https://snyk.io/test/npm/easy-puppeteer-html/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/easy-puppeteer-html
[download-image]: https://img.shields.io/npm/dm/easy-puppeteer-html.svg?style=flat-square
[download-url]: https://npmjs.org/package/easy-puppeteer-html

Capture HTML Content By [Puppeteer](https://github.com/puppeteer/puppeteer)

## Install

npm install easy-puppeteer-html --save

## Usage

```js
const puppeteer = require('easy-puppeteer-html');
const puppeteer.capture({
  url: 'http://49.233.172.37:7001/csr',
  selector: '#app',
  waitSelector: '#app',
  beforeEvaluate: async (browser, page) => {
    await page.setUserAgent('Mozilla/5.0 (Linux; U; Android 9; en-US) Chrome/57.0.2987.108 UCBrowser/12.12.5.1189 Mobile');
  },
  afterEvaluate: async (browser, page, html) => {
    return html;
  }
}).then(html => {
  console.log(html);
});
```

## Configuration

PuppeteerHtmlPrerenderPlugin options:

- **url** - prefetch render url
- **filepath** - need prerender dist file path, prerender content will inject into the file
- **selector** { optional } - fetch selector element html. if not exist, will return all html.
- **selectorOuterHTML** { optional, default: true } - return selector self node content. 
- **waitSelector** { optional } - fetch selector element html until waiting selector element exist, the config can get the client render mode html content.
- **base64** { optional, default: false } - img with class="base64" is automatically converted to base64
- **debug** { optional, default: false } - print puppeteer execute cost and key info
- **beforeEvaluate** { optional } - before evaluate fetch hook
- **afterEvaluate** { optional } - after evaluate fetch hook

## License

[MIT](LICENSE)
