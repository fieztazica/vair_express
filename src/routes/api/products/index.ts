import { Router } from 'express'
import * as controller from '../../../controllers/api/products'

export const apiProductRoute = Router()

apiProductRoute.get('/create', controller.createProduct)
apiProductRoute.get('/:productId', controller.getProduct)
apiProductRoute.get('/categories/:category', controller.getProductbyCategory)
