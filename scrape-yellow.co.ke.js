var request = require('request');
var cheerio = require('cheerio');
//var fs = require('fs');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

var result = [];
var page = 1;
const PAGES = 10;


var extractData = (page) => {
  if (page <= PAGES) {
    var url = `https://yellow.co.ke/categories/property-development/?page=${page}`;
    
    request(url, function (error, response, body) {
      if (error) {
        console.log("Error: " + error);
      }
      console.log("Status code: " + response.statusCode + " Page: " + page);
      
      var $ = cheerio.load(body);

      $('.single-product').each(function (i, elm) {
        //console.log($(elm).find($('.price')).text());
        
        var listing = {}; 
        listing.name = ($(elm).find($('.title > a')).text().trim());
        //listing.address = $(elm).find($('.address-details')).find($('p > span')).text().trim();
        
        
        //var phoneType = $(elm).find('.mlr__label').text();
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
        });

        //console.log(listing);
        result.push(listing);
        
      });//end cheerio */
      extractData(++page);
    });//end request
  } else {
    //write to csv
    const csvWriter = createCsvWriter({
      path: './yellow.co.ke-2.csv',
      header: [
        {id: 'name', title: 'Name'},
        {id: 'address', title: 'Business Address'},
        {id: 'primary', title: 'Primary Phone'},
        {id: 'mobile', title: 'Business Phone'},
        {id: 'other', title: 'Mobile Phone'}
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
    console.log(`Successfully scraped ${page - 1} pages from yellow.co.ke. ${result.length} listings found.`);
    return result;
  }
}

extractData(page);



