var Crawler = require("crawler");
var fs = require("fs");
var http = require("http");
var https = require("https");
var path= require("path");

var c = new Crawler({
    maxConnections : 10,  // 最大链接数 10
    retries: 5,  // 失败重连5次
    // This will be called for each crawled page
    callback : function (error, res, done) { // 执行下面的回调，这个回调不会执行
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            console.log($("title").text());
        }
        done();
    }
});

c.queue([{
    uri: 'https://www.mzitu.com/tag/ugirls/',
    jQuery: true,
    callback: function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;   // 这就可以想使用jQuery一个解析DOM了
            var total_pag = 0;
            $('.nav-links a').each(function(index,item){
                    if ($(item).text() == '末页') {
                        total_pag = $(item).attr('href');
                        var regexp = /[0-9]+/g;
                        total_pag = total_pag.match(regexp)[0]; // 总页数
                    }
                    
                    downloadContent(index,c)
            })
        }
        done();
    }
}]);
    
function downloadContent(i,c){
    var uri = 'https://www.mzitu.com/tag/ugirls/page/' + i + '/';
    c.queue([{
        uri: uri,
        jQuery: true,
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                var meiziSql = '';
                $('.postlist #pins li a img').each(function(index,item){
                    var src = $(item).attr('data-original');
                    console.log('获取成功',src)
                    setFile( filePath => {
                        const name = path.basename(src);
                        downloadFile(src,filePath,name)
                    })
                })
            }
            done();
        }
    }]);
}

function setFile(cb) {

    try{
        const url = 'D:/crawlerFile';
        const mode = 511;
        if(!fs.existsSync(url)){
            fs.mkdirSync(url, mode)
        }
        cb(url)
    }catch(e){
        const a = e;
    }
    
    
}

function downloadFile(url,filePath,fileName) {
    let ht;
    if(url.includes("https")) {
        ht = https;
    } else {
        ht = http;
    }
    var req = ht.get(url, (res) => {
        var imgData = "";
        //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.setEncoding("binary");
        res.on("data", (chunk) => {
            imgData += chunk;
        });
        res.on("end", () => {
            fs.writeFile(path.join(filePath,fileName), imgData, "binary");
        });;
        res.on("error",(e)=> {
            const error = e;
        })
    });
}