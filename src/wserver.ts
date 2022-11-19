import * as http from 'http';

import ExpressServer from './express';

// handle uncaught errors
process.on('unhandledRejection', (reason, p) => {
    // I just caught an unhandled promise rejection, since we already have fallback handler for unhandled errors (see below), throw and let him handle that
    throw reason;
});
process.on('uncaughtException', err => {
    // I just received an error that was never handled
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
});

// const httpPort = normalizePort( process.env.ZGE_HTTP_PORT_WEB || 38816 );
const httpPort = normalizePort( 38816 );
ExpressServer.set('port', httpPort);

const httpServer = http.createServer(ExpressServer);

httpServer.listen(httpPort);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

function normalizePort(val: number|string): number|string|boolean {
    const myPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(myPort)) return val;
    else if (myPort >= 0) return myPort;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof httpPort === 'string') ? 'Pipe ' + httpPort : 'Port ' + httpPort;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = httpServer.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`HTTP Server is listening on ${bind}`);
}
