import { Router } from 'express'
import fs from 'fs'
import * as controller from '../../controllers/uploads/index'
import { checkAuthorization } from '../../middlewares/auth'
import path from 'path'
import multer from 'multer'

// Create a directory to store uploaded files
const uploadDir = path.join(__dirname, '../../../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// Configure Multer to handle file uploads and rename the file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Rename the file here
        const newFileName = `custom-prefix-${Date.now()}${path.extname(
            file.originalname
        )}`
        cb(null, newFileName)
    },
})
const upload = multer({ storage })

export const uploadRoute = Router()

uploadRoute.post(
    '/',
    checkAuthorization,
    controller.handleUpload
)

uploadRoute.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename)

    console.log(filePath)

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath)
    } else {
        res.status(404).json({ error: 'File not found' })
    }
})
