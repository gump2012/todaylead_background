/**
 * Created by lishiming on 14-6-16.
 */
var mongoose = require('mongoose');
exports.start = function (){
    var mongodb = mongoose.connect('mongodb://115.28.225.137:27017/todaylead');

    var db = mongodb.connection;

    db.on('error',console.error.bind(console,'connection erro:'));
    db.once('open',function callback(){
        console.log('db is open success!');
        var userSchema = new mongoose.Schema({
            city                    :String
            ,province               :String
            ,area                   :String
            ,consignee              :String
            ,mobile                 :String
            ,memo                   :String
            ,ticket_id              :String
            ,token                  :String
            ,address                :String
            ,shipping_fee           :Number
            ,promotion_totalprice   :Number
            ,payment_way_id         :Number
            ,order_id               :{
                type: String,
                unique: true
            }
            ,creat_time             :String
            ,order_states           :Number
            ,payment_states         :Number
            ,shipping_states        :Number
            ,goods_number           :Number
            ,payment_name           :String
            ,express_number         :String
            ,express_name           :String
            ,productlist            :[mongoose.Schema.Types.Mixed]
        });

        mongoose.model('todayOrder',userSchema);

        var proAttrSchema = new mongoose.Schema({
            pid                 :Number
            ,attr_id            :Number
            ,goods_attr_id      :{
                type: Number,
                unique: true
            }
            ,attr_name          :String
            ,attr_value         :String
            ,attr_price         :Number
            ,attr_type          :Number
        });

        mongoose.model('todayProductAttr',proAttrSchema);

        var proSchema = new mongoose.Schema({
            pid                 :{
                type: Number,
                unique: true
            }
            ,cid                :Number
            ,title              :String
            ,volume             :Number
            ,recentvolume       :Number
            ,org_price          :Number
            ,price              :Number
            ,state              :Number
            ,stamper            :String
            ,pic_url            :String
            ,time               :Number
            ,actualvolume       :Number    //实际销量
            ,arrivaltime        :String    //上架时间
            ,gallery            :[String]
            ,detailpics         :[String]
        });

        mongoose.model('todayProduct',proSchema);

    });
};