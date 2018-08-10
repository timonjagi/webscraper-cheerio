var request = require('request');
var cheerio = require('cheerio');
//var fs = require('fs');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;

var result = [];
var page = 1;
const PAGES = 5;

var extractData = (page) => {
  if (page <= PAGES) {
    var url = `https://yellowpageskenya.com/site/index?SearchForm[what]=Construction&page=${page}`;
    
    request(url, function (error, response, body) {
      if (error) {
        console.log("Error: " + error);
      }
      console.log("Status code: " + response.statusCode);
      
      var $ = cheerio.load(body);

      $('#w1 .resultList').each(function (i, elm) {
        
        var listing = {}; 
        listing.name = $(elm).find($('.listing__name')).text().trim();
        listing.address = $(elm).find($('.listing__address')).text().trim();

        $(elm).find('ul .mlr__submenu__item').each((i, elm) => {
          var phone = $(elm).find('.mlr__label').text().trim();
          var number = $(elm).clone().children().remove().end().text().trim();

          listing[phone] = number;
        });
        console.log(listing);
        result.push(listing);
        
      });//end cheerio */
      extractData(++page);
    });//end request
  } else {
    console.log(result);
    //write to csv
    const csvWriter = createCsvWriter({
      path: './yellowpages.csv',
      header: [
        {id: 'name', title: 'NAME'},
        {id: 'address', title: 'Business Address'},
        {id: 'primary', title: 'Primary Phone'},
        {id: 'mobile', title: 'Mobile Phone'}
      ]
    });
    
    csvWriter.writeRecords(result)
      .then(() => {
        console.log('Writing to CSV... Done');
    });//end csv-writer
    
    //console.log(result);
    console.log(`Successfully scraped ${page} pages `);
    return result;
  }
}

extractData(page);



