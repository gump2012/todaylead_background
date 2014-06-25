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
        var strseparator = '____';
        var strhtml ='<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/html; '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>';

        strhtml +='<form action="/showorders" method="post">'+ '<input type="text" name="dajiji"/>'+'<input type="submit" value="确认该订单号" />'+'</form>'
        strhtml +='<form action="/addexpress" method="post">订单号:<input type="text" name="order_id" />'+
            '快递号:<input type="text" name="express_number" />'+
            '快递名称:<input type="text" name="express_name" />'+
            '<input type="submit" value="添加物流信息" />'+
            '</form>';
        strhtml += '<P align=left>';
        strhtml += '订单号';
        strhtml += strseparator;
        strhtml += '手机号';
        strhtml += strseparator;
        strhtml += '地址';
        strhtml += strseparator;
        strhtml += '联系人';
        strhtml += strseparator;
        strhtml += '商品数量';
        strhtml += strseparator;
        strhtml += '运费';
        strhtml += strseparator;
        strhtml += '总价';
        strhtml += strseparator;
        strhtml += '商品列表';
        strhtml += strseparator;
        strhtml += '留言';
        strhtml += strseparator;
        strhtml += '付款方式';
        strhtml += strseparator;
        strhtml += '快递名称代号';
        strhtml += strseparator;
        strhtml += '快递号';
        strhtml += '</P>';

        for(i in docs){
            strhtml += '<P align=left>';
            strhtml += docs[i].order_id;
            strhtml += strseparator;
            strhtml += docs[i].mobile;
            strhtml += strseparator;

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

            strhtml += strseparator;
            strhtml += docs[i].consignee;
            strhtml += strseparator;
            strhtml += '商品数量:'+docs[i].goods_number;
            strhtml += strseparator;
            strhtml += '运费:'+docs[i].shipping_fee;
            strhtml += strseparator;
            strhtml += '订单总价:';
            strhtml += new Number(docs[i].shipping_fee) + new Number(docs[i].promotion_totalprice);

            for(j in docs[i].productlist){
                if(docs[i].productlist[j].title && docs[i].productlist[j].quantity){
                    strhtml += strseparator;
                    strhtml += 'pid' + docs[i].productlist[j].pid;
                    strhtml += strseparator;
                    strhtml += docs[i].productlist[j].title;
                    strhtml += strseparator;
                    strhtml += '购买数量:' + docs[i].productlist[j].quantity;
                    if(docs[i].productlist[j].attr_list && docs[i].productlist[j].attr_list[0]){
                        strhtml += strseparator;
                        strhtml += '属性id:' + docs[i].productlist[j].attr_list[0].goods_attr_id;
                    }
                }
            }

            strhtml += strseparator;
            strhtml += '留言:'+docs[i].memo;
            strhtml += strseparator;
            strhtml += docs[i].payment_name;
            strhtml += strseparator;
            strhtml += docs[i].express_name;
            strhtml += strseparator;
            strhtml += docs[i].express_number;
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