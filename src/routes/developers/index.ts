import { Router } from 'express'
import multer from 'multer'
import * as controller from '../../controllers/developers'
import { checkAuthorizationView } from '../../middlewares/auth'

const upload = multer()

export const developerRoute = Router()

developerRoute.get('/', upload.none(), controller.loginPage)
developerRoute.post('/', upload.none(), controller.loginSubmit)
developerRoute.post('/logout', upload.none(), controller.logout)

developerRoute.get(
    '/products',
    checkAuthorizationView,
    controller.productListPage
)
developerRoute.get(
    '/products/create',
    checkAuthorizationView,
    controller.createProductPage
)
developerRoute.post(
    '/products/create',
    checkAuthorizationView,
    controller.createProduct
)
