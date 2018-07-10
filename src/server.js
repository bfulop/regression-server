const http = require('http')
const R = require('ramda')
const path = require('path')
const ecstatic = require('ecstatic')

const logger = r => {
  console.log('logger')
  console.log(r)
  console.log('logger end')
  return r
}

const st = ecstatic({
  root: path.resolve('.'),
  showdir: true
})

const isRoute = url => ([aroute]) => url.includes(aroute)

const defaultRoute = r => Promise.resolve({ default: 'default route' })

const getRoute = url =>
  R.compose(
    // logger,
    R.nth(1),
    R.head,
    R.when(R.isEmpty, r => [[null, defaultRoute]]),
    R.defaultTo('what'),
    R.filter(isRoute(url)),
    R.toPairs
  )

const sendResult = response => result => {
  response.setHeader('content-type', 'application/json')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.end(result)
  return 'done'
}

const sendJson = res => R.compose(sendResult(res), JSON.stringify, logger)

const startServer = routes => {
  http
    .createServer((req, res) => {
      let route = getRoute(req.url)(routes)
      route()
        .then(R.ifElse(
          R.prop('static'),
          x => st(req, res),
          sendJson(res)
        ))
        .catch(e => {
          console.error(e)
          return e
        })
    })
    .listen(3202)
}

module.exports = { startServer }
