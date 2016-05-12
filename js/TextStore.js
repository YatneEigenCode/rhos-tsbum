//5-12-2016 jchoy v1.212 - rename findPath to parsePath
//5-8-2016 jchoy v1.211 textStore.js - TextStore js on server side: TextStoreCgi, BumWebApp, TextStoreWebApp
//TextStore works with express, TextStoreCgi works with node-router, TextStoreWebApp works with http
//-----
TextStore = function(){
  this.assets= {}
  this.save= function(i,data){
    this.assets['t'+i]= data;
  }
  this.get= function(i){ return this.assets['t'+i]; }
  this.cgi= function(k,def,qy){
	  var at=(qy+"").split(new RegExp("[\&\?]"+k+"=")); 
	  return (at.length==1)?def:at[1].split("&")[0];
  }
  this.ucgi= function(k,def,qy){ return unescape(this.cgi(k,def,qy)); }
}
//-----
TextStoreCgi= function(){
  this.ts= new TextStore();
  this.cgi= this.ts.cgi;
  this.save= function(qy){
    this.ts.save( this._=this.cgi('i','9',qy), this.ts.ucgi('data','',qy) );
  }
  this.get= function(qy){
    return this.ts.get( this._=this.cgi('i','9',qy) );
  }
  this.startServer= function( server ){
    var $t= this;
    server.get("/ts/set/", function (request, response) {
      //ts.save( request.url );
      //response.simpleText(200, "Saved to "+ts._);
      $t.save( request.url );
      response.simpleText(200, "Saved to "+$t._);
    });
    server.get("/ts/text/", function (request, response) {
      //response.simpleText(200, ""+ts.get(request.url));
      response.simpleText(200, ""+$t.get(request.url));
    });
  }
}
//----- works with http orig package
BumWebApp= function(){
  var $svr= this;
  this.pathBums= new Array();
  this.reqHandler = function( req, res ){
    $svr.parsePath( req.url )[1](req, res);
  }
  this.notFound = function( req, res ){ $svr.sendText(res, 404, "Not found\n"); }
  this.sendText = function( res, stat, msg, ctype ){
    res.writeHead( stat, {"Content-Type": ((ctype)? ctype : "text/plain")} );
    res.end(msg);
  }
  this.parsePath = function( url ){
    var urlf = url.split('?',2)[0];
    for (var i=0,at=this.pathBums; i<at.length; i++)
      if (urlf==at[i][0]) return at[i];
    return ['',this.notFound];
  }
  this.addGetPath = function( path, fcn ){
    this.pathBums.push([path,fcn]);
  }
}
TextStoreWebApp= function(){
  (function(t,c){t.c=c;t.c()})(this,TextStoreCgi);
  (function(t,c){t.c=c;t.c()})(this,BumWebApp);
  var $t=this;
  this.addGetPath("/ts/set/", function (request, response) {
      $t.save( request.url );
      $t.sendText( response, 200, "Saved to "+$t._);
  });
  this.addGetPath("/ts/text/", function (request, response) {
      $t.sendText( response, 200, ""+$t.get(request.url));
  });
}