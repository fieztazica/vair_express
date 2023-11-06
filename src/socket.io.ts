import { Server } from 'http'
import { handleSocketConnection } from './controllers/uploads'
import { socketAuthCheck } from './middlewares/auth'
import server from './server'
import { Server as socketIo } from 'socket.io'

const io = new socketIo(server, {
    maxHttpBufferSize: 1e8,
})

io.use(socketAuthCheck)
io.on('connection', handleSocketConnection)
