import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { Socket } from 'socket.io'
import { StrapiUserLogin } from 'strapiRes'
import { KeyConst } from '../../types/keyConst'
import { cookieValueFinder } from '../../utils/cookies'
import { io } from '../../server'

interface UploadChunkData {
    chunk: ArrayBuffer | null
    fileName: string
    chunkIndex: number
}

// Create a directory to store uploaded files
const uploadDir = path.join(__dirname, '../../../uploads')

export const index = async (req: Request, res: Response): Promise<void> => {
    // Check if there are any files in the request
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' })
        return
    }
    res.json({ data: 'hi' })
}

export const downloadFile = (req: Request, res: Response) => {
    const filePath = path.join(uploadDir, req.params.filename)

    console.log(filePath)

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath)
    } else {
        res.status(404).json({ error: 'File not found' })
    }
}

export const handleSocketConnection = (socket: Socket) => {
    const user = JSON.parse(
        decodeURIComponent(
            cookieValueFinder(socket.handshake.headers.cookie, KeyConst.USER)
        )
    ) as StrapiUserLogin

    console.log(`${user.username} connected `)

    socket.on('disconnect', () => {
        console.log(`${user.username} disconnected`)
    })

    socket.on('uploadChunk', (data: UploadChunkData, ack: Function) => {
        const { chunk, fileName, chunkIndex } = data
        const filePath = path.join(uploadDir, `${user.id}`, `${fileName}`)

        if (chunk !== null) {
            try {
                const uint8Array = new Uint8Array(chunk)
                const flags = chunkIndex === 0 ? 'w' : 'a' // Use 'w' flag for the first chunk

                fs.writeFileSync(filePath, uint8Array, { flag: flags })

                // Send acknowledgment to the client
                ack({ success: true })
            } catch (err) {
                console.error('Error handling chunk:', err.message)
                ack({ success: false, error: err.message })
            }
        } else {
            // Last chunk; file upload complete
            io.to(socket.id).emit('fileUploaded', {
                fileName,
                fileUrl: `/uploads/${user.id}/${fileName}`,
            })
        }
    })
}
