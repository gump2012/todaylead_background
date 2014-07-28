/**
 * Created by lishiming on 14-7-28.
 */
var nodemailer = require("nodemailer");
var url = require("url");
var querystring = require("querystring");

exports.sendmail = function(response, request){
    var arg = url.parse(request.url).query;
    var assistant = querystring.parse(arg).orderid;

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "qq",
        auth: {
            user: "85150091@qq.com",
            pass: "1234qaz"
        }
    });

// setup e-mail data with unicode symbols

    var strtext = "有新订单"+"<br />" +
        assistant + "<br />";

    var mailOptions = {
        from: "85150091@qq.com", // sender address
        to: '85150091@qq.com', // list of receivers
        subject: "有新订单", // Subject line
        text: strtext, // plaintext body
        html: "<b>"+strtext+"</b>" // html body
    }
    smtpTransport.sendMail(mailOptions, function(error, responsemail){
        if(error){
            console.log(error);
            response.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
            response.write('sendmail fail');
            response.end();
        }else{
            console.log("Message sent: " + responsemail.message);
            response.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
            response.write('sendmail success');
            response.end();
        }
    });
}