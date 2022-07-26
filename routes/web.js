"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const web_controller_1 = __importDefault(require("../controllers/web_controller"));
let router = express_1.Router();
router.get('/', web_controller_1.default.index);
router.get('/wedding/new/:sheetId/:sheetname', web_controller_1.default.getWeddingPage);
router.post('/wedding/new', web_controller_1.default.saveCustomer);
router.get('/wedding', web_controller_1.default.getWeddingList);
router.get('/travel', web_controller_1.default.getTravelPage);
router.get('/auth-api', web_controller_1.default.getToken);
exports.default = router;
