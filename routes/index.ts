import { Router } from "express"
import webRouter from './web'
import apiRouter from './api'

let appRoute = Router()

appRoute.use('/', webRouter)
appRoute.use('/api', apiRouter)

export default appRoute