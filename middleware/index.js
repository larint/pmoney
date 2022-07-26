"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
var middleware = {
    globalLocals: function (req, res, next) {
        res.locals.session = req.session;
        req.app.locals.auth2 = {};
        next();
    },
    auth: function (req, res, next) {
        let auth = {};
        auth[process.env.auth_user || 'admin'] = process.env.auth_pass || 'admin';
        return next();
    }
};
exports.middleware = middleware;
