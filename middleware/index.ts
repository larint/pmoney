import { Request, Response, NextFunction } from 'express'

var middleware = {

    globalLocals: function (req: Request, res: Response, next: NextFunction) {
        res.locals.session = req.session
        req.app.locals.auth2 = {

        }
        next()
    },

    auth: function (req: Request, res: Response, next: NextFunction) {
        let auth: { [key: string]: any } = {}
        auth[process.env.auth_user || 'admin'] = process.env.auth_pass || 'admin'

        return next()

    }
}


export { middleware }