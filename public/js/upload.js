const fileInput = document.getElementById('fileInput')
const uploadButton = document.getElementById('uploadButton')
const progressOutput = document.getElementById('progressOutput')
const createProdForm = document.getElementById('createProdForm')

const socket = io()

const chunkSize = 1024 * 1024 // 1MB chunks
let offset = 0
let isUploading = false

fileInput.addEventListener('change', (e) => {
    e.preventDefault()
    const file = fileInput.files[0]
    if (file && file.size < 1024 * 1024) {
        alert('File too small')
        createProdForm.reset()
    }
})

uploadButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (isUploading || offset > 0) {
        return // Prevent multiple uploads
    }

    const file = fileInput.files[0]
    if (!file) {
        alert('No file provided')
        return
    }

    if (file.size < 1024 * 1024) {
        alert('File too small')
        createProdForm.reset()
        return
    }

    isUploading = true
    uploadButton.disabled = isUploading
    const fileName = file.name
    const fileSize = file.size
    socket.emit(
        'fileChunk',
        { fileName, dataChunk: null, chunkIndex: 0, totalChunks: 0 },
        (ack) => {
            if (ack.message === 'File already exists') {
                console.log(`File '${fileName}' already exists on the server.`)
                alert(`File '${fileName}' already exists on the server.`)
                createProdForm.reset()
                isUploading = false
                uploadButton.disabled = isUploading
                return
            } else {
                // Start sending file chunks
                sendFileChunks(file, fileSize)
            }
        }
    )
})

socket.on('uploadComplete', (data) => {
    progressOutput.textContent = `${data.message}`
    isUploading = false
    uploadButton.disabled = isUploading
    createProdForm.reset()
})

socket.on('connect_error', (err) => {
    alert(
        `Connection failed. ${err.message}. Please reload the page or sign in`
    )
    uploadButton.disabled = true
    console.error(err)
})

function sendFileChunks(file, fileSize) {
    const chunkSize = 1024 * 1024 // 1MB chunks
    const reader = new FileReader()
    let chunkIndex = offset / chunkSize

    const sendChunkWithDelay = () => {
        const chunkStart = offset
        const chunkEnd = Math.min(offset + chunkSize, file.size)
        const chunk = file.slice(chunkStart, chunkEnd)

        reader.onload = (event) => {
            const dataChunk = event.target.result
            socket.emit(
                'fileChunk',
                {
                    fileName: file.name,
                    dataChunk,
                    chunkIndex: offset / chunkSize,
                    totalChunks: Math.ceil(file.size / chunkSize),
                },
                (ack) => {
                    console.log(
                        `Received acknowledgment for chunk ${ack.receivedChunkIndex}`
                    )

                    if (ack.receivedChunkIndex === chunkIndex) {
                        offset += chunkSize
                        updateProgress(offset, file.size)
                        if (offset < file.size) {
                            chunkIndex = offset / chunkSize
                            setTimeout(sendChunkWithDelay, 1000) // Send next chunk after 1 second
                        } else {
                            verifyFile(file.name, fileSize)
                            offset = 0
                        }
                    }

                    if (ack.error) {
                        alert(`${error}`)
                    }
                }
            )
        }

        reader.readAsArrayBuffer(chunk)
    }

    sendChunkWithDelay() // Start sending chunks with a delay
}

function verifyFile(fileName, fileSize) {
    socket.emit('verifyFile', { fileName, fileSize })
}

function updateProgress(uploaded, total) {
    const progress = (uploaded / total) * 100
    progressOutput.textContent = `Upload Progress: ${progress.toFixed(2)}%`
}
