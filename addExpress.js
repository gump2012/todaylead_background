/**
 * Created by lishiming on 14-6-17.
 */
var querystring = require("querystring");
exports.addexpress = function(response, request){
    var requestData = '';
    request.addListener('data', function(postDataChunk) {
        requestData += postDataChunk;
    });

    request.addListener('end', function() {
        if(requestData){
            var strid = querystring.parse(requestData).order_id;
            strid += querystring.parse(requestData).express_number;
            strid += querystring.parse(requestData).express_name;
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(strid);
            response.end();
        }
    });
}