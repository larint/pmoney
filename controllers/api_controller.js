"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sheet_api_1 = require("../service/sheet_api");
class ApiController {
    constructor() {
        this.getSheets = async (req, res) => {
            let sheetList = [], authUrl = '';
            try {
                sheetList = await this.sheetApi.getAllSheet(this.auth);
            }
            catch (error) {
                authUrl = await this.sheetApi.generateAuthUrl(this.auth);
            }
            return res.render('wedding/ajax_sheets', { sheetList }, (err, html) => {
                return res.json({ data: html, authUrl: authUrl });
            });
        };
        this.getSheetDetail = async (req, res) => {
            let sheetData = [], authUrl = '', maxIndex = 0, totalAmount = 0, { sheetname, sheetId } = req.body;
            try {
                sheetData = await this.sheetApi.getData(this.auth, `${sheetname}!A1:D`);
                sheetData = sheetData.map((x, index) => {
                    if (x[3]) {
                        x.push(index + 1);
                        totalAmount += parseInt(x[3]);
                    }
                    else {
                        x.push('', index + 1);
                    }
                    return x;
                });
                sheetData = sheetData.reverse();
                let index = sheetData.map((x) => parseInt(x[0]));
                maxIndex = Math.max.apply(null, index);
            }
            catch (error) {
                authUrl = await this.sheetApi.generateAuthUrl(this.auth);
            }
            return res.render('wedding/ajax_sheet_detail', { sheetData, sheetId, sheetname, totalAmount }, (err, html) => {
                if (err) {
                    return res.sendStatus(500);
                }
                return res.json({ data: html, maxIndex, sheetData, authUrl });
            });
        };
        this.createNewSheet = async (req, res) => {
            let { name } = req.body;
            try {
                await this.sheetApi.createNewSheet(this.auth, name);
                return res.sendStatus(200);
            }
            catch (error) {
                return res.status(500).send(error.toString());
            }
        };
        this.delSheet = async (req, res) => {
            try {
                let { sheetId } = req.body;
                await this.sheetApi.deleleSheet(this.auth, sheetId);
                return res.sendStatus(200);
            }
            catch (error) {
                return res.status(500).send(error.toString());
            }
        };
        this.delSheetRow = async (req, res) => {
            try {
                let { sheetId, indexRow } = req.body;
                await this.sheetApi.deleleSheetRow(this.auth, sheetId, indexRow);
                return res.sendStatus(200);
            }
            catch (error) {
                return res.status(500).send(error.toString());
            }
        };
        this.updateRow = async (req, res) => {
            try {
                let { sheetname, indexRow, amount } = req.body;
                await this.sheetApi.updateRow(this.auth, `${sheetname}!D${indexRow}:D${indexRow}`, [
                    [amount]
                ]);
                return res.sendStatus(200);
            }
            catch (error) {
                return res.status(500).send(error.toString());
            }
        };
        this.sheetApi = new sheet_api_1.SheetApi();
        this.auth = this.sheetApi.authorize();
    }
}
exports.default = new ApiController;
