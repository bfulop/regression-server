const R = require('ramda')
const puppeteer = require('puppeteer')
const { createTargetsList, createTargetScreenshots, compareScreenshots } = require('./utils')
const { testtargets } = require('./targets')
const { startServer } = require('./server')

const addSandbox = R.compose(
  R.or(
    r => ({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }),
    r => null
  ),
  R.contains('nosandbox'),
  R.drop(2)
)

const displayResults = ({ route, width, targetelem, numDiffPixels }) => {
  // if (numDiffPixels > 100) {
  //   console.warn('diff ✗', route, width, targetelem, numDiffPixels)
  // } else {
  //   console.log('diff ✓', route, width, targetelem, numDiffPixels)
  // }
  return {route, width, targetelem, numDiffPixels}
}

const runner = xt => () => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      Promise.all(createTargetScreenshots('test')(xt))
        .then(r => Promise.all(R.map(compareScreenshots)(r)))
        .then(R.map(displayResults))
        .then(resolve)
        .catch(e => {
          console.log('================ error ==============')
          console.error(e)
          reject(e)
          return e
        })
    }, 0)
  })
}

puppeteer
  .launch(addSandbox(process.argv))
  .then(b => {
    return Promise.all(createTargetsList(b)(testtargets))
      .then(r => {
        console.log('browsers setup start')
        startServer({
          captures: x => Promise.resolve({static: true}),
          targets: x => Promise.resolve(testtargets),
          compare: runner(r),
          snapshot: x =>
            Promise.all(createTargetScreenshots('golden')(r)).then(r => {
              return { default: 'screenshots taken' }
            })
        })
        // runner(r)
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
  })
  .then(b => {
    console.log('sequence done, watching for changes')
    // b.close()
  })
  .catch(e => {
    console.error('+++++++++++++++ error ++++++++++++')
    console.error(e)
  })
