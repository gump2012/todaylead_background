/**
 * Created by lishiming on 14-6-13.
 */
var querystring = require("querystring");
var showorders = require('./showOrders');
var addex = require('./addExpress');
var sendmail = require("./sendmail");

function start(response, request) {
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" method="post">'+
        '<textarea name="text" rows="20" cols="60"></textarea>'+
        '<input type="submit" value="Submit text" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
    var requestData = '';
    request.addListener('data', function(postDataChunk) {
        requestData += postDataChunk;
    });

    request.addListener('end', function() {
        console.log("Request handler 'upload' was called.");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("You've sent the text: "+
            querystring.parse(requestData).text);
        response.end();
    });
}

exports.showorder = function(response,request){
    showorders.showorder(response,request);
}

exports.addexpress = function(response,request){
    addex.addexpress(response,request);
}

exports.sendmail = function(response,request){
    sendmail.sendmail(response,request);
}

exports.start = start;
exports.upload = upload;