import { Router } from 'express'
import * as controller from '../../../controllers/api/products'

export const apiProductRoute = Router()

apiProductRoute.get('/', controller.getProducts)
apiProductRoute.post('/', controller.createProduct)
apiProductRoute.get('/:productId', controller.getProduct)
apiProductRoute.get('/:productId/download', controller.downloadProduct)
