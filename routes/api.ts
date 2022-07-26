import { Router } from 'express'
import ApiController from '../controllers/api_controller'

let router = Router()


router.post('/getSheets', ApiController.getSheets)
router.post('/getSheetDetail', ApiController.getSheetDetail)
router.post('/newSheet', ApiController.createNewSheet)
router.post('/del-sheet', ApiController.delSheet)
router.post('/del-sheet-row', ApiController.delSheetRow)
router.post('/update-sheet-row', ApiController.updateRow)


export default router