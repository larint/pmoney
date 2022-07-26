import { Request, Response } from 'express'
import { SheetApi } from '../service/sheet_api'
import { OAuth2Client } from 'google-auth-library'

class ApiController {
    sheetApi: SheetApi
    auth: OAuth2Client
    constructor() {
        this.sheetApi = new SheetApi()
        this.auth = this.sheetApi.authorize()
    }

    getSheets = async (req: Request, res: Response) => {
        let sheetList: any = [],
            authUrl: string = ''
        try {
            sheetList = await this.sheetApi.getAllSheet(this.auth)
        } catch (error) {
            authUrl = await this.sheetApi.generateAuthUrl(this.auth)
        }
        return res.render('wedding/ajax_sheets', { sheetList }, (err, html) => {
            return res.json({ data: html, authUrl: authUrl })
        })
    }

    getSheetDetail = async (req: Request, res: Response) => {
        let sheetData: any = [],
            authUrl: string = '',
            maxIndex = 0,
            totalAmount = 0,
            { sheetname, sheetId } = req.body
        try {
            sheetData = await this.sheetApi.getData(this.auth, `${sheetname}!A1:D`)
            // add index row sheet
            sheetData = sheetData.map((x: any, index: number) => {
                if (x[3]) {
                    x.push(index + 1)
                    totalAmount += parseInt(x[3])
                } else {
                    x.push('', index + 1)
                }
                return x
            })
            sheetData = sheetData.reverse()
            // get max stt
            let index = sheetData.map((x: any) => parseInt(x[0]))
            maxIndex = Math.max.apply(null, index);
        } catch (error) {
            authUrl = await this.sheetApi.generateAuthUrl(this.auth)
        }
        return res.render('wedding/ajax_sheet_detail', { sheetData, sheetId, sheetname, totalAmount }, (err, html) => {
            if (err) {
                return res.sendStatus(500)
            }
            return res.json({ data: html, maxIndex, sheetData, authUrl })
        })
    }

    createNewSheet = async (req: Request, res: Response) => {
        let { name } = req.body
        try {
            await this.sheetApi.createNewSheet(this.auth, name)
            return res.sendStatus(200)
        } catch (error: any) {
            return res.status(500).send(error.toString())
        }
    }

    delSheet = async (req: Request, res: Response) => {
        try {
            let { sheetId } = req.body
            await this.sheetApi.deleleSheet(this.auth, sheetId)
            return res.sendStatus(200)
        } catch (error: any) {
            return res.status(500).send(error.toString())
        }
    }

    delSheetRow = async (req: Request, res: Response) => {
        try {
            let { sheetId, indexRow } = req.body
            await this.sheetApi.deleleSheetRow(this.auth, sheetId, indexRow)
            return res.sendStatus(200)
        } catch (error: any) {
            return res.status(500).send(error.toString())
        }
    }

    updateRow = async (req: Request, res: Response) => {
        try {
            let { sheetname, indexRow, amount } = req.body
            await this.sheetApi.updateRow(this.auth, `${sheetname}!D${indexRow}:D${indexRow}`, [
                [amount]
            ])
            return res.sendStatus(200)
        } catch (error: any) {
            return res.status(500).send(error.toString())
        }
    }

}

export default new ApiController