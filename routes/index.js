"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const web_1 = __importDefault(require("./web"));
const api_1 = __importDefault(require("./api"));
let appRoute = express_1.Router();
appRoute.use('/', web_1.default);
appRoute.use('/api', api_1.default);
exports.default = appRoute;
