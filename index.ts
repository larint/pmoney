//Env
require('dotenv').config()
import express from 'express'
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import path from 'path'
import methodOverride from 'method-override'
import { MessageApp } from './helpers/toastr'

// ROUTER
import appRoute from './routes'
import { middleware } from './middleware'

declare module 'express-session' {
	export interface SessionData {
		message: MessageApp,
		form: any
	}
}

const app = express()

// Real-time notification updates
let http = require("http").Server(app)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({ extended: false, parameterLimit: 10000 }))
app.use(cookieParser())
app.use(methodOverride('_method'))
// session expire time after 7 days (milliseconds)
app.use(session({ secret: "bjhbahsbdjabwdhjbwjdh", resave: true, saveUninitialized: true, cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } }))
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use(/\/(app.js|package.json)/, (req: Request, res: Response, next: NextFunction) => {
	res.sendStatus(404)
})

app.use(middleware.globalLocals)
app.use(middleware.auth)
app.use('/', appRoute)

// error handler
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	// res.status(err.status || 500);
	res.render('error')
});

app.all('*', function (req, res) {
	res.render('404')
});

http.listen(process.env.PORT || 3000, () => {
	console.log('listening @ 3000', new Date())
})
