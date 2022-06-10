const io = require('socket.io')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html')
       let readStream = fs.createReadStream(filePath)
        readStream.pipe(response)
    } else if (request.method === 'POST') {
        let data = ''
        request.on('data', chunk => {
            data += chunk
        })
        request.on('end', () => {
            const parsedData = JSON.parse(data)
            console.log(parsedData)
            response.writeHead(200, { 'Content-Type': 'json'})
            response.end(data)
        })
    } else {
        response.statusCode = 405
        response.end()
    }
})

const socket = io(app);
socket.on('connection', function (socket) {
    console.log('New connection');
    socket.broadcast.emit('NEW_CONN_EVENT', { msg: 'The new client connected' })
    socket.on('CLIENT_MSG', (data) => {
        socket.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('')})
    })
    socket.on("disconnecting", (reason) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.to(room).emit("user has left", socket.id)
            }
        }
    })
})
app.listen(3000, 'localhost')