import { Router } from 'express'
import * as controller from '../../controllers/developers'

export const developerRoute = Router()

developerRoute.get('/', controller.index)
developerRoute.get('/products/create', controller.createProductPage)
