"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetApi = void 0;
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
class SheetApi {
    constructor() {
        this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
        this.TOKEN_PATH = 'token.json';
        this.spreadsheetId = process.env.spreadsheetId;
    }
    getClientSecret() {
        try {
            let content = fs_1.default.readFileSync('credentials.json', { encoding: 'utf8', flag: 'r' });
            return JSON.parse(content);
        }
        catch (error) {
            console.log('getClientSecret', error);
            return null;
        }
    }
    authorize() {
        let credentials = this.getClientSecret();
        const { client_secret, client_id, redirect_uris } = credentials.web;
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        if (fs_1.default.existsSync(this.TOKEN_PATH)) {
            let token = fs_1.default.readFileSync(this.TOKEN_PATH, { encoding: 'utf8', flag: 'r' });
            if (token) {
                oAuth2Client.setCredentials(JSON.parse(token));
            }
        }
        return oAuth2Client;
    }
    async generateAuthUrl(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        return authUrl;
    }
    async getNewToken(oAuth2Client, code) {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    resolve(false);
                    console.error('Error while trying to retrieve access token', err);
                }
                else {
                    oAuth2Client.setCredentials(token);
                    fs_1.default.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) {
                            resolve(false);
                            console.error(err);
                        }
                        else {
                            console.log('Token stored to', this.TOKEN_PATH);
                            resolve(true);
                        }
                    });
                }
            });
        });
    }
    async getData(auth, range) {
        return new Promise((resolve, reject) => {
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: range,
            }, (err, res) => {
                if (err)
                    return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                if (rows && rows.length) {
                    resolve(rows);
                }
                else {
                    resolve([]);
                }
            });
        });
    }
    async writeData(auth, range, values) {
        return new Promise((resolve, reject) => {
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            const resource = {
                values
            };
            sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                requestBody: resource,
            }, (err, result) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    async createNewSheet(auth, title) {
        try {
            const request = {
                spreadsheetId: this.spreadsheetId,
                resource: {
                    requests: [{
                            addSheet: {
                                properties: {
                                    "title": title
                                }
                            }
                        }],
                },
                auth: auth,
            };
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            const response = (await sheets.spreadsheets.batchUpdate(request)).data;
        }
        catch (error) {
            throw error;
        }
    }
    async deleleSheet(auth, sheetId) {
        try {
            const request = {
                spreadsheetId: this.spreadsheetId,
                resource: {
                    requests: [{
                            deleteSheet: {
                                sheetId: sheetId
                            }
                        }]
                },
                auth: auth
            };
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            const response = await sheets.spreadsheets.batchUpdate(request);
        }
        catch (error) {
            throw error;
        }
    }
    async deleleSheetRow(auth, sheetId, indexRow) {
        try {
            const request = {
                spreadsheetId: this.spreadsheetId,
                resource: {
                    requests: [{
                            deleteDimension: {
                                range: {
                                    sheetId: sheetId,
                                    dimension: "ROWS",
                                    startIndex: indexRow - 1,
                                    endIndex: indexRow
                                }
                            }
                        }]
                },
                auth: auth
            };
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            const response = (await sheets.spreadsheets.batchUpdate(request)).data;
        }
        catch (error) {
            throw error;
        }
    }
    async updateRow(auth, range, values) {
        try {
            const request = {
                spreadsheetId: this.spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                resource: {
                    values
                },
                auth: auth
            };
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            const response = (await sheets.spreadsheets.values.update(request)).data;
        }
        catch (error) {
            throw error;
        }
    }
    async getAllSheet(auth) {
        var _a;
        try {
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
            let data = await sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId
            });
            let sheetList = (_a = data.data.sheets) === null || _a === void 0 ? void 0 : _a.map((o) => o.properties);
            return sheetList;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.SheetApi = SheetApi;
