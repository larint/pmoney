import { Router } from 'express'
import WebController from '../controllers/web_controller'

let router = Router()

router.get('/', WebController.index)
router.get('/wedding/new/:sheetId/:sheetname', WebController.getWeddingPage)
router.post('/wedding/new', WebController.saveCustomer)
router.get('/wedding', WebController.getWeddingList)

router.get('/travel', WebController.getTravelPage)

router.get('/auth-api', WebController.getToken)


export default router