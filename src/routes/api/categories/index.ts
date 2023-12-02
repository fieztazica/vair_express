import { Router } from "express";
import * as controller from '../../../controllers/api/categories'

export const apiCategoryRoute = Router()

apiCategoryRoute.get('/getAll', controller.getCategories)
apiCategoryRoute.get('/:category', controller.getProductByCategory)
apiCategoryRoute.get('/featured', controller.getTenCategories)
