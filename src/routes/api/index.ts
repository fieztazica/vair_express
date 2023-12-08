import { Router } from 'express'
import * as controller from '../../controllers/api'
import { apiAuthRoute } from './auth'
import { apiProductRoute } from './products'
import { apiCategoryRoute } from './categories'
import { apiBoughtRoute } from './boughts'

export const apiRoute = Router()

apiRoute.use('/auth', apiAuthRoute)
apiRoute.use('/products', apiProductRoute)
apiRoute.use('/categories', apiCategoryRoute)
apiRoute.use('/boughts', apiBoughtRoute)
