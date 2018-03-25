const R = require('ramda')
const puppeteer = require('puppeteer')
const chokidar = require('chokidar')
const { createTargetsList, createTargetScreenshots, compareScreenshots } = require('./utils')
const { testtargets } = require('./targets')

// Initialize watcher.
var watcher = chokidar.watch('./public/css/app.css', {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

function displayResults ({ route, width, targetelem, numDiffPixels }) {
  if (numDiffPixels > 100) {
    console.warn('diff ✗', route, width, targetelem, numDiffPixels)
  } else {
    console.log('diff ✓', route, width, targetelem, numDiffPixels)
  }
  return numDiffPixels
}

const runner = xt => {
  watcher.on('change', path => {
    logger(`File ${path} has been changed`)
    setTimeout(function () {
      Promise.all(createTargetScreenshots('test')(xt))
        .then(R.map(compareScreenshots))
        .then(R.map(r => r.then(displayResults)))
    }, 300)
  })
  return xt
}

puppeteer
  .launch()
  .then(b => {
    return (
      Promise.all(createTargetsList(b)(testtargets))
        .then(r => {
          console.log('browsers setup start')
          runner(r)
          return Promise.all(r)
        })
        .then(r => {
          console.log('browsers setup done')
          return b
        })
        .catch(e => {
          console.error('--------------- error ------------')
          console.error(e)
        })
    )
  })
  .then(b => {
    console.log('sequence done, watching for changes')
    // b.close()
  })
  .catch(e => {
    console.error('+++++++++++++++ error ++++++++++++')
    console.error(e)
  })
