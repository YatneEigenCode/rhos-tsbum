//5-8-2916 jchoy server-bum.js - to use with bare nodejs on android ice cold server
var http = require('http');
require( './js/TextStore.js' );
var bum = new TextStoreWebApp();
var server = http.createServer(bum.reqHandler);
var fs= require('fs');

bum.addGetPath( '/vy/', function(req, res){
    fs.writeFileSync('pdata/tstest.txt','no fs');
    bum.sendText( res, 200, "very good "+req.url )
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Bum server listening at", addr.address + ":" + addr.port);
});