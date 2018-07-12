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
  showdir: false,
  cache: 'max-age=0'
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

const startServer = routes => {
  http
    .createServer((req, res) => {
      let route = getRoute(req.url)(routes)
      route()
        .then(R.ifElse(
          R.prop('static'),
          x => st(req, res),
          r => R.compose(sendResult(res), JSON.stringify)(r)
        ))
        .catch(e => {
          console.error(e)
          return e
        })
    })
    .listen(3202)
}

module.exports = { startServer }
