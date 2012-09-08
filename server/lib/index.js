'use strict';

var http = require( 'http' ),
    server = http.createServer(),

    // The list of urls is quite thin
    urls = [
        '^/$',
        '^/prez/*',
        '^/favicon.ico$'
    ].map( function( url ) {
        // Only create the new regex once
        return new RegExp( url );
    });

server.on( 'request', function( req, res ) {
    // Check if we have the URL
    var success = urls.some( function( url ) {
        if ( url.exec( req.url ) ) {
            return true;
        }
        else {
            return false;
        }
    });

    // If we do, success!
    if ( success ) {
        var staticServer = require( './static.js' ),
            isStatic = staticServer.isStatic( req.url );

        // If the url is static, just serve the file
        if ( isStatic ) {
            staticServer.serve( req.url, req, res );
        }

        // Else, it's the socket job
        else {
            require( './socket.js' )();
        }
        console.log( 'Hit ' + req.url );
        res.writeHead( 200 );
        res.end();
    }
    else {
        console.log( 'Miss ' + req.url );
        res.writeHead( 404 );
        res.end();
    }
});


server.listen( 1111 );

