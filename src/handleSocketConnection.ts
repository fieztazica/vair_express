import path from 'path'
import fs from 'fs'
import { Socket } from 'socket.io'

// Create a directory to store uploaded files
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

export default (socket: Socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('fileChunk', (data, ack) => {
        const { fileName, dataChunk, chunkIndex, totalChunks } = data

        const filePath = path.join(uploadDir, fileName)

        // Write the data chunk to the file
        fs.appendFile(filePath, dataChunk, (err) => {
            if (err) {
                console.error('Error writing file chunk:', err)
                ack({
                    receivedChunkIndex: chunkIndex,
                    error: 'Error writing file chunk',
                })
            } else {
                console.log(`Received and saved chunk ${chunkIndex}`)
                ack({ receivedChunkIndex: chunkIndex })
            }
        })
    })

    socket.on('verifyFile', (data) => {
        const { fileName, fileSize } = data
        const filePath = path.join(uploadDir, fileName)

        // Get the size of the saved file on the server
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Error reading file size:', err)
            } else {
                if (stats.size === fileSize) {
                    console.log('File sizes match between client and server.')
                    socket.emit('uploadComplete', {
                        message: `Upload Complete`,
                    })
                } else {
                    console.log(
                        'File sizes do not match between client and server.'
                    )
                    socket.emit('uploadComplete', { message: `Upload Failed` })

                    // Delete the file on the server if sizes do not match
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting file:', unlinkErr)
                        } else {
                            console.log('File deleted on the server.')
                        }
                    })
                }
            }
        })
    })
}
