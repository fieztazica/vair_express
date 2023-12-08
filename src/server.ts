import { app } from './app'
import { Server as socketIo } from 'socket.io'
import { handleSocketConnection } from './controllers/uploads'
import { socketAuthCheck } from './middlewares/auth'

const port = app.get('port')

export const server = app.listen(port, onListening)
export const io = new socketIo(server, {
    maxHttpBufferSize: 1e8,
})

io.use(socketAuthCheck)
io.on('connection', handleSocketConnection)
server.on('error', onError)

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
    console.log(`Listening on ${bind}`)
}

export default server
