const fileInput = document.getElementById('fileInput')
const uploadButton = document.getElementById('uploadButton')
const progressBar = document.getElementById('progress')
const createProdForm = document.getElementById('createProdForm')
const resultDisplay = document.getElementById('resultDisplay')

const socket = io()

fileInput.addEventListener('change', (e) => {
    e.preventDefault()
    const file = fileInput.files[0]
    if (file && file.size < 1024 * 1024) {
        alert('File too small')
        createProdForm.reset()
        return
    }
    sendChunksSequentially(file)
})

function sendChunksSequentially(file) {
    fileInput.style.display = 'none'
    progressBar.style.display = 'block'
    progressBar.value = 0
    progressBar.max = 100

    const CHUNK_SIZE = 1024 * 1024 // Adjust the chunk size as needed
    const CHUNK_UPLOAD_DELAY = 500
    let offset = 0
    const reader = new FileReader()

    const sendNextChunk = () => {
        const chunk = file.slice(offset, offset + CHUNK_SIZE)
        reader.readAsArrayBuffer(chunk)
    }

    reader.onload = (event) => {
        if (event.target && event.target.result) {
            const chunkData = {
                chunk: event.target.result,
                fileName: file.name,
                chunkIndex: offset === 0 ? 0 : Math.floor(offset / CHUNK_SIZE),
            }

            setTimeout(() => {
                socket.emit('uploadChunk', chunkData, (ack) => {
                    if (ack.success) {
                        offset += CHUNK_SIZE

                        const progress = (offset / file.size) * 100
                        progressBar.value = progress

                        if (offset < file.size) {
                            sendNextChunk() // Send the next chunk if file not fully uploaded
                        } else {
                            // Last chunk; file upload complete
                            const lastChunkData = {
                                chunk: null,
                                fileName: file.name,
                                chunkIndex: -1, // Indicate the last chunk
                            }
                            socket.emit('uploadChunk', lastChunkData)
                        }
                    } else {
                        console.error(
                            'Error occurred while uploading chunk:',
                            ack.error
                        )
                        // Handle error, perhaps retry or inform the user
                        setTimeout(sendNextChunk, CHUNK_UPLOAD_DELAY)
                    }
                })
            }, CHUNK_UPLOAD_DELAY)
        }
    }

    sendNextChunk() // Start the process by sending the first chunk
}

socket.on('connect_error', (err) => {
    alert(
        `Connection failed. ${err.message}. Please reload the page or sign in`
    )
    // uploadButton.disabled = true
    console.error(err)
})

socket.on('fileUploaded', (data) => {
    console.log('File uploaded:', data.fileName)
    progressBar.value = 100
    progressBar.style.display = 'none'

    resultDisplay.style.display = 'block'
    resultDisplay.value = data.fileUrl
})
