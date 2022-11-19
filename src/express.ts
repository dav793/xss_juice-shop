import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import AppRouter from './routes';

class ExpressServer {

	public express: express.Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
		this.handleErrors();
	}
	
	private middleware(): void {
		// third party middleware
		this.express.use(cors());
		this.express.use(morgan('dev', {stream: process.stdout}));
		this.express.use(bodyParser.json({limit: '50mb'}));
		this.express.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
	}
	
	private routes(): void {
		
		this.express.use('/', AppRouter);
		
		// 404 response
		this.express.all('*', (req: any, res: any) => {
		    console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
		    res.sendStatus(404);
		});
		
	}
	
	private handleErrors(): void {
		this.express.use((err, req, res, next) => {

			if (res.headersSent)
				return next(err);    // delegate to default error-handler if response has already begun being sent

			switch (err.name) {
				case 'UnauthorizedError':   // thrown when no authorization header is found in a protected route
					res.status(401).send(err.message);  // 401 - unauthorized
					break;
				default:
					res.status(500).send(`${err.name}: ${err.message}: ${err.stack}`);
					break;
			}
		});
	}

}

export default new ExpressServer().express;
