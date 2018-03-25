const path = require('path')
global.testDir = path.resolve('./visual regression tests/testDir')
global.goldenDir = path.resolve('./visual regression tests/goldenDir')

global.testtargets = [
  {
    sizes: {
      width: 383,
      height: 1200
    },
    route: null,
    id: 'mobile'
  }
]