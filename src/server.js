const http = require('http')
const R = require('ramda')

const isRoute = url => ([aroute]) => url.includes(aroute)

const defaultRoute = r => Promise.resolve({default: r})

const getRoute = url =>
  R.compose(
    R.nth(1),
    R.head,
    R.when(R.isEmpty, r => [[null, defaultRoute]]),
    R.defaultTo('what'),
    R.filter(isRoute(url)),
    R.toPairs
  )

const startServer = routes => {
  http
    .createServer((req, res) => {
      getRoute(req.url)(routes).then(R.compose(res.end, JSON.stringify))
    })
    .listen(3202)
}

module.exports = { startServer }
