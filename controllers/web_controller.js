"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toastr_1 = require("../helpers/toastr");
const sheet_api_1 = require("../service/sheet_api");
const helpers_1 = require("../helpers");
class WebController {
    constructor() {
        this.index = async (req, res) => {
            return res.render('home/index');
        };
        this.getWeddingList = async (req, res) => {
            return res.render('wedding/index');
        };
        this.getWeddingPage = async (req, res) => {
            let { sheetId, sheetname } = req.params;
            return res.render('wedding/create', { sheetId, sheetname });
        };
        this.saveCustomer = async (req, res) => {
            let { id, prefixname, name, sheetname } = req.body;
            await this.sheetApi.writeData(this.auth, `${sheetname}!A1`, [
                [id, prefixname, helpers_1.capitalizeFirstLetter(name)]
            ]);
            toastr_1.ToaStr.set(req, { show: 'toast', type: 'success', content: 'Đã lưu' });
            req.session.form = req.body;
            return res.redirect('back');
        };
        this.getTravelPage = async (req, res) => {
            return res.render('travel/index');
        };
        this.getToken = async (req, res) => {
            let code = req.query.code;
            await this.sheetApi.getNewToken(this.auth, code);
            toastr_1.ToaStr.set(req, { show: 'toast', type: 'success', content: 'Đã xác thực api' });
            return res.redirect('/');
        };
        this.sheetApi = new sheet_api_1.SheetApi();
        this.auth = this.sheetApi.authorize();
    }
}
exports.default = new WebController;
