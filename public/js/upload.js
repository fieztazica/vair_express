const fileInput = document.getElementById('fileInput')
const uploadButton = document.getElementById('uploadButton')
const progressOutput = document.getElementById('progressOutput')

const token = localStorage.getItem('token')

const socket = io({
    auth: {
        token: `Bearer ${token}`,
    },
})

const chunkSize = 1024 * 1024 // 1MB chunks
let offset = 0
let isUploading = false

uploadButton.addEventListener('click', () => {
    if (isUploading) {
        return // Prevent multiple uploads
    }

    isUploading = true
    uploadChunks()
})

socket.on('uploadComplete', (data) => {
    progressOutput.textContent = `Upload Complete: ${data.fileName}`
    isUploading = false
})

socket.on('connect_error', (err) => {
    console.log(err.message) // not authorized
    console.log(err.data) // { content: "Please retry later" }
})

function uploadChunks() {
    const file = fileInput.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
            const dataChunk = event.target.result
            const isFinal = offset + dataChunk.byteLength >= file.size

            // Send the data after a simulated delay (e.g., 1 second)
            setTimeout(() => {
                socket.emit('fileChunk', {
                    fileName: file.name,
                    dataChunk,
                    isFinal,
                })

                if (!isFinal) {
                    offset += chunkSize
                    updateProgress(offset, file.size)
                    uploadChunks() // Upload the next chunk
                }
            }, 1000) // Simulated delay of 1 second (adjust as needed)
        }

        const blob = file.slice(offset, offset + chunkSize)
        reader.readAsArrayBuffer(blob)
    }
}

function updateProgress(uploaded, total) {
    const progress = (uploaded / total) * 100
    progressOutput.textContent = `Upload Progress: ${progress.toFixed(2)}%`
}
