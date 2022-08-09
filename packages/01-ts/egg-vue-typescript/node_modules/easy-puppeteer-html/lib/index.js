const path = require('path');
const fs = require('fs');
const util = require('util');
const urllib = require('urllib');
const chalk = require('chalk');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

exports.requirePuppeteerModule = name => {
  try {
    return require(name);
  } catch (e) {
    throw new Error(chalk.red(`missing puppeteer dependency, please set puppeteer env path ${chalk.yellow('process.env.PUPPETEER_MODULE_PATH')} or ${chalk.yellow('npm install puppeteer --save-dev')}`));
  }
};

exports.evaluate = async options => {
  const {
    url,
    selector,
    selectorOuterHTML = true,
    waitSelector,
    beforeEvaluate,
    afterEvaluate,
    debug = false,
    modulePath = process.env.PUPPETEER_MODULE_PATH
  } = options;
  const start = Date.now();
  const puppeteer = exports.requirePuppeteerModule(modulePath || 'puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (beforeEvaluate) {
    await beforeEvaluate(browser, page);
  }
  await page.goto(url);

  // must exist element node
  if (waitSelector) {
    // https://github.com/istanbuljs/nyc/issues/514
    /* istanbul ignore next */
    // eslint-disable-next-line arrow-parens
    await page.waitFor((id) => {
      /* istanbul ignore next */
      const app = document.querySelector(id);
      return app && app.childNodes.length > 0;
    }, [], waitSelector);
  }

  let html;
  if (selector) {
    if (selectorOuterHTML) {
      html = await page.$eval(selector, e => e.outerHTML);
    } else {
      html = await page.$eval(selector, e => e.innerHTML);
    }
  } else {
    html = await page.content();
  }

  if (afterEvaluate) {
    html = await afterEvaluate(browser, page, html);
  }
  await browser.close();
  if (debug) {
    console.debug(`\r\n puppeteer cost: ${Date.now() - start}ms`);
    console.debug(`\r\n puppeteer html: \r\n ${html}`);
  }
  return html;
};


exports.evaluateHTMLRender = async(html, options) => {
  const { selector, placeholder, debug } = options;
  const evaluatedHTML = await exports.evaluate(options);
  let replacePlaceholder = placeholder;
  if (html && selector && !placeholder) {
    const fragment = JSDOM.fragment(html);
    const dom = fragment.querySelector(selector);
    replacePlaceholder = dom.outerHTML;
    if (debug) {
      console.debug(`\r\n puppeteer selector, placeholder, replacePlaceholder: ${selector}, ${placeholder}, ${replacePlaceholder}`);
    }
  }
  if (replacePlaceholder) {
    return html.replace(replacePlaceholder, evaluatedHTML);
  }
  return evaluatedHTML;
};


exports.imageToBase64 = async html => {
  const reg = /<img[\s]+class=['"][^<>]*base64[^<>]+['"]+[^<>]+src=['"]([^'"]+)['"][^<>]+>/g;
  const imageList = [];
  let result;

  // eslint-disable-next-line no-cond-assign
  while ((result = reg.exec(html)) != null) {
    if (result[1] && /^(https:)?\/\//.test(result[1])) {
      imageList.push(result[1]);
    }
  }

  for (const url of imageList) {
    const request = util.promisify(urllib.request);
    const buffer = await request(url, { timeout: 30000 });
    const base64 = buffer.toString('base64');
    html = html.replace(url, `data:image/webp;base64,${base64}`);
  }
  return html;
};

exports.normalizeOption = options => {
  const configFile = path.resolve(process.cwd(), 'puppeteer.config.js');
  if (fs.existsSync(configFile)) {
    const configOptions = require(configFile);
    return {
      ...options,
      ...configOptions
    };
  }
  return options;
};

exports.captureForHtml = async(html, options) => {
  const { base64 } = options;
  const evaluateHTML = await exports.evaluateHTMLRender(html, options);
  return base64 ? exports.imageToBase64(evaluateHTML) : evaluateHTML;
};

exports.capture = async options => {
  const _options = exports.normalizeOption(options);
  const { html = '', filepath } = _options;
  const targetFilepath = path.isAbsolute(filepath) ? filepath : path.join(process.cwd(), filepath);
  const existsTargetFile = fs.existsSync(targetFilepath);
  const targetHtml = existsTargetFile ? fs.readFileSync(targetFilepath, 'utf8') : html;
  const renderedHtml = await exports.captureForHtml(targetHtml, _options);
  console.log(chalk.green('puppeteer rendered capture content:\r\n'), renderedHtml);
  if (existsTargetFile) {
    fs.writeFileSync(targetFilepath, renderedHtml, 'utf8');
    console.log(chalk.green(`puppeteer rendered ${chalk.yellow(targetFilepath)} successfully!`));
  }
  return renderedHtml;
};