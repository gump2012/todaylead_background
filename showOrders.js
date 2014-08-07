/**
 * Created by lishiming on 14-6-16.
 */
var mongoose = require('mongoose');
var regionarr = require('./region');
var querystring = require("querystring");
var strseparator = '____';
var strhtml = '';
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
                    if(doc.order_states == 0){
                        doc.order_states = 1;
                        doc.save(function( err, silence ) {
                            if( err )
                            {
                                console.log(err);
                            }

                            returnOrders(response);
                        });
                        addVolume(doc);
                    }
                    else{
                        returnOrders(response);
                    }
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

        strhtml ='<html>'+
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
        strhtml +='<form action="/showdeleteorders" method="get">'+'<input type="submit" value="显示被煞笔们删除的订单" />'+'</form>'
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
        strhtml += strseparator;
        strhtml += '来自渠道'
        strhtml += '</P>';

        fillOrderInfo(docs,0,response);


    });
}

function fillOrderInfo(docs,index,response){
    if(index < docs.length){
        strhtml += '<P align=left>';
        strhtml += docs[index].order_id;
        strhtml += strseparator;
        strhtml += docs[index].mobile;
        strhtml += strseparator;

        var straddress = '';
        for(j in regionarr.regionarr){
            if(docs[index].province == regionarr.regionarr[j].id){
                straddress += regionarr.regionarr[j].region_name;
            }
        }
        for(j in regionarr.regionarr){
            if(docs[index].city == regionarr.regionarr[j].id){
                straddress += regionarr.regionarr[j].region_name;
            }
        }
        for(j in regionarr.regionarr){
            if(docs[index].area == regionarr.regionarr[j].id){
                straddress += regionarr.regionarr[j].region_name;
            }
        }

        straddress += docs[index].address;

        strhtml += straddress;

        strhtml += strseparator;
        strhtml += docs[index].consignee;
        strhtml += strseparator;
        strhtml += '商品数量:'+docs[index].goods_number;
        strhtml += strseparator;
        strhtml += '运费:'+docs[index].shipping_fee;
        strhtml += strseparator;
        strhtml += '订单总价:';
        strhtml += new Number(docs[index].shipping_fee) + new Number(docs[index].promotion_totalprice);

        fillProductInfo(docs,docs[index].productlist,0,index,response);
    }
    else{
        strhtml += '</body>'+
            '</html>';

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(strhtml);
        response.end();
    }
}

function fillProductInfo(docs,products,pindex,index,response){
    if(pindex >= products.length){
        strhtml += strseparator;
        strhtml += '留言:'+docs[index].memo;
        strhtml += strseparator;
        strhtml += docs[index].payment_name;
        strhtml += strseparator;
        strhtml += docs[index].express_name;
        strhtml += strseparator;
        strhtml += docs[index].express_number;
        strhtml += strseparator;
        strhtml += '来自:'+docs[index].channel;
        strhtml += '</P>';

        if(docs[index].order_states == 1){
            strhtml += '<P align=left><font color="green">已确认</font></P>';
        }
        else{
            strhtml += '<P align=left><font color="red">未确认</font></P>';
        }
        fillOrderInfo(docs,index+1,response);
    }
    else{
        if(products[pindex].title && products[pindex].quantity){
            strhtml += strseparator;
            strhtml += 'pid' + products[pindex].pid;
            strhtml += strseparator;
            strhtml += products[pindex].title;
            strhtml += strseparator;
            strhtml += '购买数量:' + products[pindex].quantity;
            if(products[pindex].attr_list && products[pindex].attr_list[0]){
                attrmodel = mongoose.model('todayProductAttr');
                attrmodel.findOne({goods_attr_id:products[pindex].attr_list[0].goods_attr_id},'attr_value',function(err,doc){
                    strhtml += strseparator;
                    if(doc){
                        strhtml += '属性:' + doc.attr_value;
                    }
                    else{
                        strhtml += '属性:没有这个属性id' + products[pindex].attr_list[0].goods_attr_id;
                    }

                    fillProductInfo(docs,products,pindex+1,index,response);
                });
            }
            else{
                strhtml += strseparator;
                strhtml += '商品怎么没属性呢';
                fillProductInfo(docs,products,pindex+1,index,response);
            }
        }
    }
}

function addVolume(doc){
    if(doc.productlist){
        addOneVolume(doc.productlist,0);
    }
}

function addOneVolume(productlist,index){
    if(index < productlist.length){
        productmodel = mongoose.model('todayProduct');
        productmodel.findOne({pid:productlist[index].pid},function(err,doc){
            if(doc){
                if(doc.actualvolume){
                    doc.actualvolume += new Number(productlist[i].quantity);
                }
                else{
                    doc.actualvolume = new Number(productlist[i].quantity);
                }
                doc.save( function( err, silence ) {
                    if( err )
                    {
                        console.log(err);
                    }
                });
            }
            addOneVolume(productlist,index+1);
        });
    }
}

exports.showdelorder = function (response, request){
    returndelOrders(response);
}

function returndelOrders(response){
    var ordermodel = mongoose.model('todayDeleteOrder');
    ordermodel.find({},{},{sort:{'_id': -1}},function(err,docs){

        strhtml ='<html>'+
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
        strhtml +='<form action="/showdeleteorders" method="get">'+'<input type="submit" value="显示被煞笔们删除的订单" />'+'</form>'
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
        strhtml += strseparator;
        strhtml += '来自渠道'
        strhtml += '</P>';

        fillOrderInfo(docs,0,response);


    });
}
