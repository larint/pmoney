import { Request, Response } from 'express'
import { ToaStr } from '../helpers/toastr'
import { SheetApi } from '../service/sheet_api'
import { OAuth2Client } from 'google-auth-library'
import { capitalizeFirstLetter } from '../helpers'

class WebController {
    sheetApi: SheetApi
    auth: OAuth2Client
    constructor() {
        this.sheetApi = new SheetApi()
        this.auth = this.sheetApi.authorize()
    }
    index = async (req: Request, res: Response) => {

        return res.render('home/index')
    }

    getWeddingList = async (req: Request, res: Response) => {
        return res.render('wedding/index')
    }

    getWeddingPage = async (req: Request, res: Response) => {
        let { sheetId, sheetname } = req.params
        return res.render('wedding/create', { sheetId, sheetname })
    }

    saveCustomer = async (req: Request, res: Response) => {
        let { id, prefixname, name, sheetname } = req.body

        await this.sheetApi.writeData(this.auth, `${sheetname}!A1`, [
            [id, prefixname, capitalizeFirstLetter(name)]
        ])
        ToaStr.set(req, { show: 'toast', type: 'success', content: 'Đã lưu' })
        req.session.form = req.body
        return res.redirect('back')
    }

    getTravelPage = async (req: Request, res: Response) => {

        return res.render('travel/index')
    }


    getToken = async (req: Request, res: Response) => {
        let code = req.query.code as string
        await this.sheetApi.getNewToken(this.auth, code)
        ToaStr.set(req, { show: 'toast', type: 'success', content: 'Đã xác thực api' })
        return res.redirect('/')
    }
}

export default new WebController