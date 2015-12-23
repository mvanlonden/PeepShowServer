#!/usr/bin/env node


/* Express 3 requires that you instantiate a `http.Server` to attach socket.io to first */
var app = require('express')(),
    express = require('express'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

app.set('port', (process.env.PORT || 5000));
server.listen(app.get('port'));
console.log("Express server listening on port " + app.get('port'));

app.use(express.bodyParser());

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});



var socketImage;
//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

  socket.emit('ping', { msg: 'Hello. I am sent from the futra.' });

  socketImage = function(buf) {
    socket.emit('image', { image: true, buffer: buf.toString('base64') });
  }


  // Emit a message to send it to the client.
  socket.emit('ping', { msg: 'Hello. I know socket.io.' });
  fs.readFile(__dirname + '/testImage.png', function(err, buf){
    if (err) {
      console.warn(err);
    }
    // socket.emit('image', { image: true, buffer: buf.toString('base64') });
  });

  // Print messages from the client.
  socket.on('pong', function (data) {
    // console.log(data.msg);
  });

});

app.post('/image', function (req, res) {
  console.log('post request received');
  var body = req.files.image;
  console.log('body', body);
  if (body.path) {
    fs.readFile(body.path, function (err, buf) {
      socketImage(buf);
    // var buf = new Buffer(body, 'binary');
    // var buf = new Buffer(body);
    // socketImage(buf);
      res.send(200);
    });
  } else {
    res.send('failed image upload');
  }
});
