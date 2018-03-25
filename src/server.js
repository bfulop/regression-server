const http = require('http')
const R = require('ramda')

const logger = r => {
  console.log(r)
  return r
}

const isRoute = url => ([aroute]) => url.includes(aroute)

const defaultRoute = r => Promise.resolve({ default: 'default route' })

const getRoute = url =>
  R.compose(
    logger,
    R.nth(1),
    R.head,
    R.when(R.isEmpty, r => [[null, defaultRoute]]),
    R.defaultTo('what'),
    R.filter(isRoute(url)),
    R.toPairs
  )

const sendResult = response => result => {
  response.setHeader('content-type', 'application/json')
  response.end(result)
  return 'done'
}

const startServer = routes => {
  http
    .createServer((req, res) => {
      let route = getRoute(req.url)(routes)
      route()
        .then(R.compose(sendResult(res), JSON.stringify))
        .catch(e => {
          console.error(e)
          return e
        })
    })
    .listen(3202)
}

module.exports = { startServer }
