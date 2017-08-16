var express = require('express');
var SoapClient = require('node-soap-client').SoapClient;
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var app = express();
app.use(bodyParser.xml({
    limit:'1MB',
    xmlParseOptions:{
        normalize:true,
        normalizeTags:true,
        explicitArray:false
    }
}));
app.get('/',function(req,res){
    res.sendFile(__dirname + "/" + "/client.html");
})
app.post('/getAge',bodyParser.urlencoded({extended:false}),function(req,res){
    console.log(req.body);
    var input = req.body;
    console.log(input.biodata.weight);
    console.log(input.biodata.height);
    /* 
    -beginning of soap body
    -url is defined to point to server.js so that soap cient can consume soap server's remote service
    -args supplied to remote service method
    */
    var url = 'http://www.pttplc.com/webservice/pttinfo.asmx?WSDL';
    var args = {weight:input.biodata.weight,height:input.biodata.height};
    new SoapClient({wsdl: url}).init(function(err,ptt){
        if(err)
            console.error(err);
        else {
            ptt.CurrentOilPrice(args,function(err,response){
                if(err)
                    console.error(err);
                else{
                    console.log(response);
                    res.send(response);
                    console.log(response);
                }
            })
        }
    });
})
var server = app.listen(3036,function(){
    var host = "127.0.0.1";
    var port = server.address().port;
    console.log("server running at http://%s:%s\n",host,port);
})