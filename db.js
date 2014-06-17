/**
 * Created by lishiming on 14-6-16.
 */
var mongoose = require('mongoose');
exports.start = function (){
    var mongodb = mongoose.connect('mongodb://182.92.80.203:27017/todaylead');

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
            ,productlist            :[mongoose.Schema.Types.Mixed]
        });

        mongoose.model('todayOrder',userSchema);

    });
};