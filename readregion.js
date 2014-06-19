/**
 * Created by lishiming on 14-6-16.
 */
var fs = require('fs');
var text = fs.readFileSync('./region.txt', "utf8");
var regionarr = [];
var i = 0;
text.split(/\r?\n/).forEach(function (line) {
    ++i;
   var linarr = line.split("|");
    var item = {
        id:linarr[0]
        ,region_name:linarr[3]
    }

    regionarr.push(item);

    if(i == 3821){
        console.log(regionarr);
    }
});