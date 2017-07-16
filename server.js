var express = require('express')

var app = express();

var port = process.env.PORT || 3000
var server = app.listen(port, () => {
  console.log(`Node listening to port: ${port}`)
})

app.use(express.static('public'))

var marketList = [];

var io = require('socket.io')(server)

var api = require('./api-request.js')


//new connection
io.sockets.on('connection', socket => {
    console.log("We have a new client: " + socket.id);
    //give current data
    io.sockets.emit('stocks', marketList)

    socket.on('stockAdd', data => {
      api(data, obj => {
        if(!obj.errors){
          marketList.push({
            'name': obj["name"],
            'code': obj["ticker"],
            'desc': obj["short_description"]
          })
          io.sockets.emit('stocks', marketList)
        }
      })
    })

    socket.on('stockDelete', i => {
      marketList.splice(i,1)
      io.sockets.emit('stocks', marketList)
    })

    //on disconnect
    socket.on('disconnect', () => {
      console.log("Client has disconnected");
    });
  }
);
