import { Router } from "express";
import * as controller from '../../../controllers/api/categories'

export const apiCategoryRoute = Router()

apiCategoryRoute.get('/', controller.getCategories)
