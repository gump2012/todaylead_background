/**
 * Created by lishiming on 14-6-16.
 */
var mongoose = require('mongoose');
var regionarr = require('./region');

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
            strhtml += '</P>';

            if(docs[i].order_states == 0){
                 strhtml += '<button type="button">确认</button>';
            }
            else{
                strhtml += '<P align=left><font color="red">已确认</font></P>';
            }
        }

        strhtml += '</body>'+
            '</html>';

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(strhtml);
        response.end();
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