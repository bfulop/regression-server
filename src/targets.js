const path = require('path')
const R = require('ramda')

const paths = {
  test: path.resolve('./captures/testDir'),
  golden: path.resolve('./captures/goldenDir')
}

const baseUrl = 'http://127.0.0.1:3014/app_dev.php/'

let testtargets = [
  {
    route: 'film/balint-test',
    elements: ['header.pageheader', '.filmsummary', '.filmawards .sectionheader', '.filmlabels__item', '.filmcredits .simpleblockheader', '.filmpress__header', '.filmdirector__header', '.filmdirector__actions', '.filmdirector__filmslistheader', '.filmslist__afilm'],
    targets: [
      {
        width: 1200,
        elements: []
      },
      {
        width: 788,
        elements: []
      },
      {
        width: 383,
        elements: []
      }
    ]
  },
  // {
  //   route: null,
  //   elements: ['li.filmcard', '.homehero'],
  //   targets: [
  //     {
  //       width: 1200,
  //       elements: []
  //     },
  //     {
  //       width: 768,
  //       elements: []
  //     },
  //     {
  //       width: 383,
  //       elements: []
  //     }
  //   ]
  // }
]

function mergeTargetElements (anelem) {
  const elems = R.prop('elements', anelem)
  function addParentElements(item) {
    return R.merge(item, {elements: R.concat(item.elements, elems)})
  }
  return R.merge(anelem, {targets: R.compose(R.map(addParentElements), R.prop('targets'))(anelem)})
}

testtargets = R.map(mergeTargetElements)(testtargets)


module.exports = { testtargets, baseUrl, paths }
