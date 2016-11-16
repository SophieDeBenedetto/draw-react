var express = require('express')
var webpack = require('webpack')
var path = require('path')
var bodyParser = require('body-parser')
var config = require('./webpack.dev.config')
var open = require('open')
/* eslint-disable no-console */



const port = 8080;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

var jsonParser = bodyParser.json();
app.use(jsonParser)

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json({type: 'application/json'}));
app.use(require('webpack-hot-middleware')(compiler));
// app.use(favicon(__dirname + '/assets/public/favicon.ico'));

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, './index.html'));
});

const server = app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});

const io = require('socket.io')(server);


 io.on('connection', (socket) => {
  console.log('a user connected');
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

 app.post('/draw', jsonParser, function(req, resp) {
    console.log('in POST /draw')
    console.log('request body:', req.body.drawCoords)
    io.emit('draw event', req.body.drawCoords);
 })

