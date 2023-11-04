import { Router } from 'express'
import * as controller from '../../controllers/api'

export const apiRoute = Router()

apiRoute.get('/', controller.index)
