import * as express from "express";
import * as createError from 'http-errors';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose'

const app = express()
const allRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

allRoutes.forEach(router => {
	app.use('/', router);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
	next()
});

mongoose.connect(
	'localhost:27018',
	{
		keepAlive: true,
		autoIndex: false,
		autoReconnect: true
	}
).then(() => {
	app.listen(() => {
		console.log('server listening...')
	})
})
