var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
var log = console.log;


var serve = serveStatic( 'example/res', {'index': ['index.html', 'index.htm']} )

var server = http.createServer(function onRequest(req, res) {
    serve(req, res, finalhandler(req, res))
})
   
// Listen 
server.listen(8511,function(err){
    if( err ) throw err;
    log( 'example start on: http://127.0.0.1:8511' );
})