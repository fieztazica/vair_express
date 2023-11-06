import { Router } from 'express'
import * as controller from '../../controllers/api'
import { apiAuthRoute } from './auth'
import { apiProductRoute } from './products'

export const apiRoute = Router()

apiRoute.use('/auth', apiAuthRoute)
apiRoute.use('/products', apiProductRoute)
