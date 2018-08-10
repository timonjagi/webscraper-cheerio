var request = require('request');
var cheerio = require('cheerio');
//var fs = require('fs');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

var result = [];
var page = 1;
const PAGES = 300;


var extractData = (page) => {
  if (page <= PAGES) {
    var url = `https://www.kenyaplex.com/business-directory/?start=${page}&categoryid=304`;
    
    request(url, function (error, response, body) {
      if (error) {
        console.log("Error: " + error);
        return;
      }
      console.log("Status code: " + response.statusCode);
      
      var $ = cheerio.load(body);

      $('#wrap .c-logo-box').each(function (i, elm) {
        //console.log($(elm).find($('.price')).text());
        
        var listing = {}; 
        var entry = $(elm).find($('.c-detail')).first().text().trim();
        //listing.phone = $(elm).find($('.c-detail')).eq(1).text().trim()
        
        var strSplit = entry.split(',');
        listing.name = strSplit[0];
        
        var regex =  /[^0-9]/gi;

        var phoneNumber = entry.replace(regex, '');
        listing.phone = phoneNumber;

        /* 
        var strArray = entry.match(/(\d+)/g);
        let index = 0;
        
        for (index; index < strArray.length; i++){
          listing.phone = $('p').append(strArray[i]);
        } */
        
       /*  //var phoneType = $(elm).find('.mlr__label').text();
        $(elm).find('.address-details').first().each((i, elm) => {
          listing.address = $(elm).find('span').text();
          //var number = $(elm).clone().children().remove().end().text().trim();
          //console.log(elm);
          //listing[phone] = number;
        });
        
        $(elm).find('.address-details').eq(1).each((i, elm) => {
           $(elm).find('span').each((i, elm) => {
            if (i === 0){
              listing['primary'] = $(elm).text();
            } else if (i === 1) {
              listing['mobile'] = $(elm).text();
            } else {
              listing['other'] = $(elm).text();
            }
            
           });
        }); */

        console.log(listing);
        result.push(listing);
        
      });//end cheerio */
      extractData(page+30);
    });//end request
  } else {
    //write to csv
    const csvWriter = createCsvWriter({
      path: './kenyaplex.com.csv',
      header: [
        {id: 'name', title: 'Name'},
        {id: 'phone', title: 'Primary Phone'},
      ],
      append: true
    });
    console.log(result);
    csvWriter.writeRecords(result)
      .then(() => {
        console.log('Writing to CSV... Done');
    });
    /* --- write to json*/ 
    //fs.appendFileSync('cars.json', JSON.stringify(result));
    console.log(`Successfully scraped kenyaplex.com. ${result.length} listings found.`);
    return result;
  }
}

extractData(page);



