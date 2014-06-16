/**
 * Created by lishiming on 14-6-16.
 */
var mongoose = require('mongoose');

exports.showorder = function(response, request){
    var ordermodel = mongoose.model('todayOrder');
    ordermodel.find({},{},{sort:{'_id': -1}},function(err,docs){
        var strhtml ='<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/html; '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>';

        for(i in docs){
            strhtml += '<P align=left>这段在浏览器的左侧</P>';
        }

        strhtml += '</body>'+
            '</html>';

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(body);
        response.end();
    });
}