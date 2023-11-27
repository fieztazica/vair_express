import { Router } from 'express'
import * as controller from '../../controllers/api'
import { apiAuthRoute } from './auth'
import { apiProductRoute } from './products'
import { apiCategoryRoute } from './categories'

export const apiRoute = Router()

apiRoute.use('/auth', apiAuthRoute)
apiRoute.use('/products', apiProductRoute)
apiRoute.use('/categories', apiCategoryRoute)
