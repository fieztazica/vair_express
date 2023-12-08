import { Router } from 'express'
import * as controller from '../../../controllers/api/boughts'
import { checkAuthorization } from '../../../middlewares/auth'

export const apiBoughtRoute = Router()

apiBoughtRoute.get('/', checkAuthorization, controller.getBoughts)

