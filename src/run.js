// concept taken from 
// https://meowni.ca/posts/2017-puppeteer-tests/#the-thing-that-does-the-diffing
// by Monica Dinculescy


const fs = require('fs')
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const { takeAndCompareScreenshot } = require('./utils')

describe('👀 screenshots are correct', function() {
  let polyserve, browser, page, testDef;
  this.timeout(5000);

  before(async function() {
    console.log('testdir', testDir)
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

    if (!fs.existsSync(`${testDir}/mobile`)) fs.mkdirSync(`${testDir}/mobile`);
    if (!fs.existsSync(`${testDir}/tablet`)) fs.mkdirSync(`${testDir}/tablet`);
    if (!fs.existsSync(`${testDir}/desktop`)) fs.mkdirSync(`${testDir}/desktop`);
  });

  beforeEach(async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(() => browser.close());

  describe('home mobile', function() {
    beforeEach(async function() {
      testDef = testtargets[0]
      return page.setViewport(testDef.sizes);
    });
    it('/home', async function() {
      return takeAndCompareScreenshot(page, testDef.route, testDir, testDef.id);
    });
  });
});