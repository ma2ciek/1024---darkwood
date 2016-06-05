"use strict";

const hapi = require('hapi');

const server = new hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {
    if (err) {
        throw eer;
    }
    
    server.register(require('inert'), (err) => {
        if (err) {
            throw eer;
        }

        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: './'
                }
            }
        });
    })
});
