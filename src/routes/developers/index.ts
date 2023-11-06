import { Router } from 'express'
import * as controller from '../../controllers/developers'
import { checkAuthorization } from '../../middlewares/auth'

export const developerRoute = Router()

developerRoute.get('/', controller.index)
developerRoute.get('/products/create', checkAuthorization, controller.createProductPage)
