import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
dotenv.config();

import route from './routes/index.js';
import { connect } from './config/db/index.js';

// //authentication middleware
import { checkToken } from './authentication/auth.js';
import { runTask } from './authentication/expriesTimes.js';

const app = express();
app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: 'SECRET',
	})
);
app.use(passport.initialize());
app.use(passport.session());
// parse phần thân của request dưới dạng x-www-form-urlencoded
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// parse phần thân của request dưới dạng JSON
app.use(express.json());

app.use(
	cors({
		origin: '*', // chỉ cho phép truy cập từ nguồn này
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // cho phép các phương thức này
		allowedHeaders: ['Content-Type', 'Authorization'], // cho phép các header này
	})
);

runTask();
app.use(checkToken);

const PORT = process.env.PORT ?? 3003;

// HTTP logger dùng để không gõ lại lệnh npm start hay vì node index.js
app.use(morgan('combined'));

route(app); // Đường dẫn router đối tác

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

app.listen(PORT, async () => {
	// Connect to DB
	await connect();
	console.log(`App listening on port ${PORT}`);
});
