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

        strhtml += '<P align=left>';
        strhtml += '订单号';
        strhtml += '________';
        strhtml += '手机号';
        strhtml += '</P>';
        for(i in docs){
            strhtml += '<P align=left>';
            strhtml += docs[i].order_id;
            strhtml += '________';
            strhtml += docs[i].mobile;
            strhtml += '</P>';
        }

        strhtml += '</body>'+
            '</html>';

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(strhtml);
        response.end();
    });
}