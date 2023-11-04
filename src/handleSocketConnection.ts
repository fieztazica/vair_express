import path from 'path'
import fs from 'fs'
import { Socket } from 'socket.io'

export default (socket: Socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on("clickUpload", () => {
        console.log("clicked")
    })

    socket.on('fileChunk', (data) => {
        const { fileName, dataChunk, isFinal } = data

        const filePath = path.join(__dirname, '../uploads', fileName)
        fs.appendFileSync(filePath, dataChunk)

        if (isFinal) {
            socket.emit('uploadComplete', { fileName })
        }
    })
}
