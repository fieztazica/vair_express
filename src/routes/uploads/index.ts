import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import * as controller from '../../controllers/uploads'

export const uploadRoute = Router()

uploadRoute.get('/download/:filename', controller.downloadFile)
