const httpServer = require('http-server');
const should = require('chai').should()
const puppeteer = require('puppeteer')
const { percySnapshot } = require('@percy/puppeteer')
const platform = require("os").platform()
// We need to change the args passed to puppeteer based on the platform they're using
const puppeteerArgs = /^win/.test(platform) ? [] : [ '--single-process' ]
const PORT = process.env.PORT_NUMBER || 8000;
const TEST_URL = `http://localhost:${PORT}`

describe('TodoMVC', function() {
  let page
  let server
  let browser

  before(() => {
    server = httpServer.createServer({ root: `${__dirname}/..`})
    server.listen(PORT)
  });

  after(() => {
    server.close()
  });

  beforeEach(async function() {
    // Create a new Puppeteer browser instace for each test case
    browser = await puppeteer.launch({
      headless: true,
      timeout: 10000,
      args: puppeteerArgs
    })
    page = await browser.newPage()
  })

  afterEach(function() {
    // Close the Puppeteer browser instance.
    browser.close()
  })

  it('Loads the app', async function() {
    await page.goto(TEST_URL)
    const mainContainer = await page.$('div.todoapp')
    should.exist(mainContainer)
    console.log('x', mainContainer.innerText);
    await percySnapshot(page, this.test.fullTitle())
  })
})
