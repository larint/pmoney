import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

class SheetApi {
    // If modifying these scopes, delete token.json.
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    TOKEN_PATH = 'token.json'

    spreadsheetId = process.env.spreadsheetId

    getClientSecret() {
        try {
            // Load client secrets from a local file.
            let content = fs.readFileSync('credentials.json', { encoding: 'utf8', flag: 'r' })
            return JSON.parse(content)
        } catch (error) {
            console.log('getClientSecret', error)
            return null
        }
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize() {
        let credentials: { web: any } = this.getClientSecret()
        const { client_secret, client_id, redirect_uris } = credentials.web
        const oAuth2Client: OAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]
        )

        // Check if we have previously stored a token.
        if (fs.existsSync(this.TOKEN_PATH)) {
            let token = fs.readFileSync(this.TOKEN_PATH, { encoding: 'utf8', flag: 'r' })
            if (token) {
                oAuth2Client.setCredentials(JSON.parse(token))
            }
        }

        return oAuth2Client
    }

    async generateAuthUrl(oAuth2Client: OAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        })

        return authUrl
    }
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    async getNewToken(oAuth2Client: OAuth2Client, code: string) {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err: any, token: any) => {
                if (err) {
                    resolve(false)
                    console.error('Error while trying to retrieve access token', err)
                } else {
                    oAuth2Client.setCredentials(token)
                    // Store the token to disk for later program executions
                    fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) {
                            resolve(false)
                            console.error(err)
                        } else {
                            console.log('Token stored to', this.TOKEN_PATH)
                            resolve(true)
                        }
                    })
                }
            })
        })
    }

    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    async getData(auth: any, range: string) {
        return new Promise((resolve, reject) => {
            const sheets = google.sheets({ version: 'v4', auth })
            sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: range,
            }, (err, res: any) => {
                if (err) return console.log('The API returned an error: ' + err)
                const rows = res.data.values
                if (rows && rows.length) {
                    resolve(rows)
                } else {
                    resolve([])
                }
            })
        })
    }

    async writeData(auth: any, range: string, values: string[][]) {
        return new Promise((resolve, reject) => {
            const sheets = google.sheets({ version: 'v4', auth })
            const resource = {
                values
            }
            sheets.spreadsheets.values.append(
                {
                    spreadsheetId: this.spreadsheetId,
                    range: range,
                    valueInputOption: 'RAW',
                    requestBody: resource,
                },
                (err: any, result: any) => {
                    if (err) {
                        // Handle error
                        console.log(err)
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                }
            )
        })
    }

    async createNewSheet(auth: any, title: string) {
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
            }
            const sheets = google.sheets({ version: 'v4', auth })
            const response = (await sheets.spreadsheets.batchUpdate(request)).data
        } catch (error) {
            throw error
        }
    }

    async deleleSheet(auth: any, sheetId: number) {
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
            }
            const sheets = google.sheets({ version: 'v4', auth })
            const response = await sheets.spreadsheets.batchUpdate(request)
        } catch (error) {
            throw error
        }
    }

    async deleleSheetRow(auth: any, sheetId: number, indexRow: number) {
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
            }
            const sheets = google.sheets({ version: 'v4', auth })
            const response = (await sheets.spreadsheets.batchUpdate(request)).data;
        } catch (error) {
            throw error
        }
    }

    async updateRow(auth: any, range: string, values: string[][]) {
        try {

            const request = {
                spreadsheetId: this.spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                resource: {
                    values
                },
                auth: auth
            }
            const sheets = google.sheets({ version: 'v4', auth })
            const response = (await sheets.spreadsheets.values.update(request)).data;
        } catch (error) {
            throw error
        }
    }

    async getAllSheet(auth: any) {
        try {
            const sheets = google.sheets({ version: 'v4', auth })
            let data = await sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId
            })
            let sheetList = data.data.sheets?.map((o) => o.properties)
            return sheetList
        } catch (error) {
            throw error
        }
    }
}

export { SheetApi }