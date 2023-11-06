import { Router } from 'express'
import * as controller from '../../../controllers/api/products'

export const apiProductRoute = Router()

apiProductRoute.get('/create', controller.create)
