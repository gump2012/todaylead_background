/**
 * Created by lishiming on 14-6-16.
 */
var mongoose = require('mongoose');
var regionarr = require('./region');
var querystring = require("querystring");

exports.showorder = function(response, request){

    var requestData = '';
    request.addListener('data', function(postDataChunk) {
        requestData += postDataChunk;
    });

    request.addListener('end', function() {
        if(requestData){
            var ordermodel = mongoose.model('todayOrder');
            var strid = querystring.parse(requestData).dajiji;
            ordermodel.findOne({order_id:strid},function(err,doc){
                if(doc){
                    doc.order_states = 1;
                    doc.save(function( err, silence ) {
                        if( err )
                        {
                            console.log(err);
                        }

                        returnOrders(response);
                    });
                }
                else{
                    returnOrders(response);
                }
            })
        }
        else{
            returnOrders(response);
        }
    });
}

function getaddress(orderitem){
    var straddress = '';
    for(i in regionarr.regionarr){
        if(orderitem.province == regionarr.regionarr[i].id){
            straddress += regionarr.regionarr[i].region_name;
        }
    }
    for(i in regionarr.regionarr){
        if(orderitem.city == regionarr.regionarr[i].id){
            straddress += regionarr.regionarr[i].region_name;
        }
    }
    for(i in regionarr.regionarr){
        if(orderitem.area == regionarr.regionarr[i].id){
            straddress += regionarr.regionarr[i].region_name;
        }
    }

    straddress += orderitem.address;
    return straddress;
}

function returnOrders(response){
    var ordermodel = mongoose.model('todayOrder');
    ordermodel.find({},{},{sort:{'_id': -1}},function(err,docs){
        var strhtml ='<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/html; '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>';

        strhtml +='<form action="/showorders" method="post">'+ '<input type="text" name="dajiji"/>'+'<input type="submit" value="确认" />'+'</form>'

        strhtml += '<P align=left>';
        strhtml += '订单号';
        strhtml += '________';
        strhtml += '手机号';
        strhtml += '________';
        strhtml += '地址';
        strhtml += '________';
        strhtml += '联系人';
        strhtml += '________';
        strhtml += '商品数量';
        strhtml += '________';
        strhtml += '运费';
        strhtml += '________';
        strhtml += '总价';
        strhtml += '________';
        strhtml += '商品列表';
        strhtml += '________';
        strhtml += '留言';
        strhtml += '________';
        strhtml += '付款方式';
        strhtml += '</P>';

        for(i in docs){
            strhtml += '<P align=left>';
            strhtml += docs[i].order_id;
            strhtml += '________';
            strhtml += docs[i].mobile;
            strhtml += '________';

            var straddress = '';
            for(j in regionarr.regionarr){
                if(docs[i].province == regionarr.regionarr[j].id){
                    straddress += regionarr.regionarr[j].region_name;
                }
            }
            for(j in regionarr.regionarr){
                if(docs[i].city == regionarr.regionarr[j].id){
                    straddress += regionarr.regionarr[j].region_name;
                }
            }
            for(j in regionarr.regionarr){
                if(docs[i].area == regionarr.regionarr[j].id){
                    straddress += regionarr.regionarr[j].region_name;
                }
            }

            straddress += docs[i].address;

            strhtml += straddress;

            strhtml += '________';
            strhtml += docs[i].consignee;
            strhtml += '________';
            strhtml += docs[i].goods_number;
            strhtml += '________';
            strhtml += docs[i].shipping_fee;
            strhtml += '________';
            strhtml += new Number(docs[i].shipping_fee) + new Number(docs[i].promotion_totalprice);

            for(j in docs[i].productlist){
                if(docs[i].productlist[j].title && docs[i].productlist[j].quantity){
                    strhtml += '________';
                    strhtml += docs[i].productlist[j].title;
                    strhtml += '________';
                    strhtml += docs[i].productlist[j].quantity;
                }
            }

            strhtml += '________';
            strhtml += docs[i].memo;

            if(docs[i].payment_way_id == 1){
                strhtml += '货到付款';
            }else if(docs[i].payment_way_id == 2){
                strhtml += '支付宝';
            }
            strhtml += '</P>';

            if(docs[i].order_states == 1){
                strhtml += '<P align=left><font color="green">已确认</font></P>';
            }
            else{
                strhtml += '<P align=left><font color="red">未确认</font></P>';
            }
        }

        strhtml += '</body>'+
            '</html>';

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(strhtml);
        response.end();
    });
}