var request = require('request');
var cheerio = require('cheerio');
//var fs = require('fs');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

var result = [];
var page = 0;
const PAGES = 100;

function extractData(page) { 
    if (page < PAGES){
        request(`https://www.google.com/search?client=firefox-b-ab&q=contractors+kenya+listing&npsic=0&rflfq=1&rlha=0&rllag=-1288423,36846392,3097&tbm=lcl&ved=2ahUKEwjF7OSTmdbcAhVGVhoKHTVoCZsQjGp6BAgGEDw&tbs=lrf:!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:2&rldoc=1&biw=1440&bih=763#rlfi=hd:;si:;mv:!1m3!1d66313.48891790131!2d36.83105775!3d-1.3062973!2m3!1f0!2f0!3f0!3m2!1i613!2i399!4f13.1;start:${page}`, function(error, response, body) {
            console.log(`${response.statusCode}: Page ${page/20}`);
            
            if (error){
                console.log(error);
            } else {
                var $ = cheerio.load(body);
                $('div.cXedhc').each(function() {
                    var title = $(this).find($('[role="heading"]'));
                    var text = title.text();
    
                    console.log(text);
                });
            } 
        });
        extractData(page+20);
    } else {
        return;
    }   
}
extractData(page);



