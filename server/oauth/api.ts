import env = require('../env')
import Hapi = require('hapi')
import R = require('ramda')
import fetch = require('node-fetch')
import basic = require('basic-authorization-header');


export const routeAuthConfig = {
    method: 'GET',
    path: '/auth',
    handler: redirectHandler
} as Hapi.IRouteConfiguration

export const routeAuthCallbackConfig = {
    method: 'GET',
    path: '/auth/callback',
    handler: callbackHandler
} as Hapi.IRouteConfiguration

function redirectHandler(request, reply: Hapi.IReply) {
    console.log("sup")
    const url = `https://${env.oauth.baseUrl}authorize?client_id=${env.oauth.clientId}&response_type=code&state=fuckit&redirect_uri=http://${env.server.ip}:${env.server.port}/auth/callback&scope=mysubreddits`
    reply.redirect(url)
}
console.log(basic(env.oauth.clientId, env.oauth.secret))
function callbackHandler(request: Hapi.Request, reply) {
        fetch(`https://${env.oauth.baseUrl}access_token`, {
        method: 'POST',
        headers: { Authorization: basic(env.oauth.clientId, env.oauth.secret) },
        body: { 
            grant_type: 'authorization_code', 
            code: request.query.code,
            redirect_uri: `http://${env.server.ip}:${env.server.port}/auth/callback`}
        })
        .then((res) => res)
        .then((res) => {
            reply(res.body);
        })
        .catch((err => reply(err.message)))
}

export function handleAuthenticationHeader (request: Hapi.Request, reply: Hapi.IReply) {
    if (request.path === 'auth/callback') {
        reply.continue()
        return
    }

    R.path(['state', 'token'], request)
        ? setHeadersAndContinue(request, reply)
        : redirectToAuth(request, reply)
}

function setHeadersAndContinue(request, reply: Hapi.IReply) {
    request.response.header('Authorization', `bearer ${request.state.token}`)
    reply.continue();
}

function redirectToAuth(request: Hapi.Request, reply) {
    reply.redirect(`http://${process.env.IP}:${process.env.PORT}/auth`)
}