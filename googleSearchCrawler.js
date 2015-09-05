var fs = require('fs');
var Crawler = require("crawler");
var url = require('url');
var c = new Crawler({
		maxConnections : 10,
		jQuery: 'cheerio',
		rateLimits: 500, //ms
		callback : function (error, result , $) {
				if(error){
						console.error(error);
						return;
				}
				var path = result.socket._httpMessage.path;
				var url_parts = url.parse(path, true);
				var query = url_parts.query;
				var recordCnt = query.start || 0; 
				console.error("current crawling :" + path);
				$(".g").each(function(i, e) {
						var data = {};
						data.title = $(e).find(".r").text();
						data.link = $(e).find("a").attr("href");
						data.snippet = $(e).find(".st").text();
						//console.log("keyword: "+query.q+"<"+data.title+"> : ["+data.link+"]"+" {"+ data.snippet + "}");
						if(data.title!=="" && data.snippet!==""){
								console.log("@keyword:"+query.q+"\n@priority:"+
											(recordCnt++)+"\n@title:"+data.title+"\n@link:"+data.link+
										   "\n@snippet:"+data.snippet);
						}
				});
		}
});
function traverseDict(){
		if(!process.argv[2]){
				console.error("node <pragram> <dictionaryFile>");
				return;
		}
		var dict = fs.readFileSync(process.argv[2] , {encoding: "utf8"})
		var i = 0;
		while (i < dict.length ){
				var j = dict.indexOf("\n", i);
				if (j == -1){
						j = dict.length;
				}
				else{
						googleCrawler(encodeURIComponent(dict.substring(i,j)) , {page: 2 , start:0});

				}
				i = j+1;                                                         
		}
}
function googleCrawler(keyword , options){
		options = options || {};
		var pageNum = options.page || 2 ; // maybe use options to control, now use 2 to testing
		var startNum= options.start || 0;
		for (var i =0; i < pageNum ; i++){
				startNum = i*10
				var path = "/search?q="+keyword+"&oq="+keyword+"&aqs=chrome.0.69i59j0j69i60j69i65l3.687j0j7&sourceid=chrome"+"&es_sm=122&ie=utf8&oe=utf8&start="+startNum;
				var options = {
						url: 'https://www.google.com.tw'+path,
						port: 443,
						headers: {
								authority: 'www.google.com.tw',
								method: 'GET',
								path: path,
								scheme: 'https',
								accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
								'accept-language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
								'cache-control': 'no-cache',
								pragma: 'no-cache',
								'upgrade-insecure-requests': '1',
								'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36'
						}
				};
				c.queue(options);
		}
}
traverseDict();
