const R = require('ramda')
const puppeteer = require('puppeteer')
const { createTargetsList, createTargetScreenshots } = require('./utils')
const { testtargets } = require('./targets')

puppeteer
  .launch()
  .then(b => {
    return Promise.all(createTargetsList(b)(testtargets))
      .then(createTargetScreenshots('golden'))
      .then(r => {
        console.log('screenshot requests sent', r)
        return Promise.all(r)
      })
      .then(r => {
        console.log('screenshots done')
        return b
      })
      .catch(e => {
        console.error('--------------- error ------------')
        console.error(e)
      })
  })
  .then(b => {
    console.log('sequence done, closing browsers')
    b.close()
  })
  .catch(e => {
    console.error('+++++++++++++++ error ++++++++++++')
    console.error(e)
  })
