const fs = require('fs')
const R = require('ramda')
const PNG = require('pngjs').PNG
const expect = require('chai').expect
const pixelmatch = require('pixelmatch')
const { baseUrl, paths } = require('./targets')

global.logger = r => {
  console.log('logger:')
  console.log(r)
  return r
}

const mergeRoutes = prop =>
  R.compose(R.map(R.merge({ route: R.prop('route', prop) })))(R.prop('targets', prop))

const createTargets = prop => R.map(e => Object.assign({ element: e }, prop))(R.prop('elements', prop))

const createPages = browser => async target => {
  const page = await browser.newPage()
  await page.setViewport({ width: target.width, height: 900 })
  await page.goto(`${baseUrl}/${target.route || ''}`)
  return Object.assign({}, { page }, target)
}

const createTargetsList = b => R.compose(R.map(createPages(b)), R.chain(mergeRoutes))

const createTargetScreenshots = t =>
  R.compose(R.map(s => takeScreenshot(s.page, s.route, s.width, s.element, t)), R.chain(createTargets))

const sanitizeText = R.compose(R.replace(/\s|\W/g, '_'), r => r.toString(), R.defaultTo('index'))

const createFolder = R.ifElse(fs.existsSync, R.identity, r => {
  fs.mkdirSync(r)
  return r
})

const safeCreatePath = (acc, path) => createFolder(`${acc}/${sanitizeText(path)}`)

const createPath = R.reduce(safeCreatePath)

async function takeAndCompareScreenshot (page, route, dir, filePrefix) {
  const filename = await takeScreenshot(page, route, dir, filePrefix)
  return compareScreenshots(filename)
}

async function takeScreenshot (page, route, width, targetelem, dir) {
  console.log('taking screenshot for', route, width, targetelem, dir)
  let filePath = createPath(R.prop(dir, paths), [route, width])
  const main = await page.$(targetelem)
  return main
    .screenshot({ path: `${filePath}/${sanitizeText(targetelem)}.png` })
    .then(e => ({ page, route, width, targetelem, dir }))
}

function compareScreenshots ({ page, route, width, targetelem, dir }) {
  return new Promise((resolve, reject) => {
    const img1 = fs
      .createReadStream(
        `${createPath(R.prop('test', paths), [route, width])}/${sanitizeText(targetelem)}.png`
      )
      .pipe(new PNG())
      .on('parsed', doneReading)
    const img2 = fs
      .createReadStream(
        `${createPath(R.prop('golden', paths), [route, width])}/${sanitizeText(targetelem)}.png`
      )
      .pipe(new PNG())
      .on('parsed', doneReading)

    let filesRead = 0
    function doneReading () {
      // Wait until both files are read.
      if (++filesRead < 2) return

      // The files should be the same size.
      expect(img1.width, 'image widths are the same').equal(img2.width)
      expect(img1.height, 'image heights are the same').equal(img2.height)

      // Do the visual diff.
      const diff = new PNG({ width: img1.width, height: img2.height })
      const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
        threshold: 0.1
      })

      // The files should look the same.
      // expect(numDiffPixels, 'number of different pixels').equal(0);
      resolve({ page, route, width, targetelem, dir, numDiffPixels })
    }
  })
}

module.exports = { compareScreenshots, createTargetsList, createTargetScreenshots }
