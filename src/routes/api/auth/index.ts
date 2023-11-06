import { Router } from 'express'
import * as controller from '../../../controllers/api/auth'

export const apiAuthRoute = Router()

apiAuthRoute.get('/login', controller.login)
