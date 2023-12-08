import express from 'express'
import logger from 'morgan'
import * as path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import * as dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'

import { errorHandler, errorNotFoundHandler } from './middlewares/errorHandler'

dotenv.config()

// Routes imports
import { homeRoute } from './routes/home'
import { apiRoute } from './routes/api'
import { developerRoute } from './routes/developers'
import { uploadRoute } from './routes/uploads'
import { apiBoughtRoute } from './routes/api/boughts'

// import { index } from './routes/developers/index'
// Create Express server
export const app = express()

/**
 *  App Configuration
 */
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Express configuration

app.use(express.static(path.join(__dirname, '../public')))

app.use(logger('dev'))

app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views'))
app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')

// Routes configs
app.use('/uploads', uploadRoute)
app.use('/api', apiRoute)
app.use('/developers', developerRoute)
app.use('/boughts', apiBoughtRoute)
app.use('/', homeRoute)

// middleware handlers
app.use(errorNotFoundHandler)
app.use(errorHandler)
