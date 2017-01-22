import Hapi = require('hapi')
import oauth = require('./oauth')
import R = require('ramda')
import env = require('./env')

const server = new Hapi.Server()
const PORT = process.env.port
server.connection({ port: env.server.port })

server.state('redditTV', {
  ttl: 60 * 60 * 1000,
  isSecure:false,
  isHttpOnly: true,
  encoding: 'iron',
  password: 'michl56ouaiouaihaighchampdemaislareussite'
})

// server.ext('onPreResponse', oauth.api.handleAuthenticationHeader)

server.route({
    method: 'GET',
    path: '/',
    handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        reply('gnnnnn')
    }
 })

server.route(oauth.api.routeAuthConfig)
server.route(oauth.api.routeAuthCallbackConfig)
server.start((err) => console.log(`server started on ${env.server.ip}:${env.server.port}`))