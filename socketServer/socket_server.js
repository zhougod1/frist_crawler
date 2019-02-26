var app = require('express')();
var ht = require('http').Server(app)
var server = require('socket.io');
var io = server(ht);

ht.listen(8000)

app.get('/', (req,res) => {
  res.send('hello')
})

io.of('/message').on('connect', function(socket) {
  console.log('connect success')
  const space = socket.nsp;
  socket.on('setMessage', function(data) {
    space.emit('getMessage', data)
  })
})
