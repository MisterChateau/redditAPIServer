define("index", ["require", "exports", "hapi", "./oauth"], function (require, exports, Hapi, oauth) {
    "use strict";
    var server = new Hapi.Server();
    var PORT = process.env.port || 8000;
    server.connection({ port: PORT });
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply('gnnnn');
        }
    });
    console.log(oauth);
    server.route(oauth.api);
    server.start(function () { return console.log("server started on " + PORT); });
});
