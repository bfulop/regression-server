const path = require('path')

const paths = {
  test: path.resolve('./visual regression tests/testDir'),
  golden: path.resolve('./visual regression tests/goldenDir')
}

const baseUrl = 'http://127.0.0.1:3014/app_dev.php/'

const testtargets = [
  {
    route: 'all/film/balint-test',
    targets: [
      {
        width: 1200,
        elements: ['header.pageheader']
      },
      {
        width: 768,
        elements: ['header.pageheader']
      }
    ]
  }
]

module.exports = { testtargets, baseUrl, paths }
