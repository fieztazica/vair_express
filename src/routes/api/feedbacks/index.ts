import { Router } from 'express'
import * as controller from '../../../controllers/api/feedbacks'
import { checkAuthorization, checkDeveloper } from '../../../middlewares/auth'

export const apiFeedbackRoute = Router()

apiFeedbackRoute.get('/product/:productId', controller.getFeedbacksByProduct)
apiFeedbackRoute.get(
    '/bought/:boughtId',
    checkAuthorization,
    controller.getFeedbacksByBought
)
