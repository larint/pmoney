"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_controller_1 = __importDefault(require("../controllers/api_controller"));
let router = express_1.Router();
router.post('/getSheets', api_controller_1.default.getSheets);
router.post('/getSheetDetail', api_controller_1.default.getSheetDetail);
router.post('/newSheet', api_controller_1.default.createNewSheet);
router.post('/del-sheet', api_controller_1.default.delSheet);
router.post('/del-sheet-row', api_controller_1.default.delSheetRow);
router.post('/update-sheet-row', api_controller_1.default.updateRow);
exports.default = router;
