function bootstrap() {
    try {
        import('./server')
        import('./socket.io')
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
