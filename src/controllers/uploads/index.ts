import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

export const index = async (req: Request, res: Response): Promise<void> => {
    // Check if there are any files in the request
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' })
        return
    }
    res.json({ data: 'hi' })
}

export const handleUpload = async (req: Request, res: Response) => {
    if (!req.headers['content-length']) {
        return res.status(400).json({ error: 'No file uploaded' })
    }

    const totalSize = parseInt(req.headers['content-length'], 10)
    let receivedBytes = 0

    const filePath = path.join(__dirname, 'uploads', 'uploaded-file.txt')
    const fileStream = fs.createWriteStream(filePath)

    req.on('data', (data) => {
        receivedBytes += data.length

        // Calculate and send the upload progress
        const progress = (receivedBytes / totalSize) * 100
        res.write(`\nUpload Progress: ${progress.toFixed(2)}%\n`)

        // Write the received data to the file
        fileStream.write(data)
    })

    req.on('end', () => {
        fileStream.end()
        res.json({ message: 'File uploaded successfully' })
    })
}
