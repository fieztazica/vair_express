import { Router } from 'express'
import * as controller from '../../controllers/home/index'

export const homeRoute = Router()

homeRoute.get('/', controller.index)
homeRoute.get('/about', controller.about)
