/**
 * Created by lishiming on 14-6-17.
 */
var querystring = require("querystring");
var mongoose = require('mongoose');
exports.addexpress = function(response, request){
    var requestData = '';
    request.addListener('data', function(postDataChunk) {
        requestData += postDataChunk;
    });

    request.addListener('end', function() {
        if(requestData){
            var strid = querystring.parse(requestData).order_id;
            var expressnumber = querystring.parse(requestData).express_number;
            var expressname = querystring.parse(requestData).express_name;

            var ordermodel = mongoose.model('todayOrder');
            var strid = querystring.parse(requestData).dajiji;

            response.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
            if(strid && strid.length > 0 &&
                expressname && expressname.length > 0 &&
                expressnumber && expressnumber.length > 0){
                ordermodel.findOne({order_id:strid},function(err,doc){
                    if(doc){
                        doc.express_number = expressnumber;
                        doc.express_name = expressname;
                        doc.save( function( err, silence ) {
                            if( err )
                            {
                                console.log(err);
                                response.write('保存失败');
                                response.end();
                            }
                            else{
                                response.write('保存成功');
                                response.end();
                            }
                        });
                    }
                    else{
                        response.write('无此订单');
                        response.end();
                    }
                });
            }else{
                response.write('参数不完整');
                response.end();
            }

        }
    });
}