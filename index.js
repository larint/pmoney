"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const app = express_1.default();
let http = require("http").Server(app);
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false, parameterLimit: 10000 }));
app.use(cookie_parser_1.default());
app.use(method_override_1.default('_method'));
app.use(express_session_1.default({ secret: "bjhbahsbdjabwdhjbwjdh", resave: true, saveUninitialized: true, cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(/\/(app.js|package.json)/, (req, res, next) => {
    res.sendStatus(404);
});
app.use(middleware_1.middleware.globalLocals);
app.use(middleware_1.middleware.auth);
app.use('/', routes_1.default);
app.use((err, req, res, next) => {
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.render('error');
});
app.all('*', function (req, res) {
    res.render('404');
});
http.listen(process.env.PORT || 3000, () => {
    console.log('listening @ 3000', new Date());
});
