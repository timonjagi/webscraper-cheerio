var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var result = [];
var page = 1;
const PAGES = 5;

const options = {

}

var extractData = (page) => {
  if (page <= PAGES) {
    var url = `http://www.kenyads.com/listings.php?page=${page}&category=8`;
    
    request(url, function (error, response, body) {
      if (error) {
        console.log("Error: " + error);
      }
      //console.log("Status code: " + response.statusCode);
      //
      var $ = cheerio.load(body);

      $('#right_content .classified').each(function (i, elm) {
        //console.log($(elm).find($('.price')).text());
        var listing = {  
          title: $(elm).find($('h3')).text().trim(),
          photo: $(elm).find($('.pic')).attr('src'),
          price: $(elm).find('.price').text().trim(),
          location: $(elm).find('.location').text().trim(),
          description: $(elm).find('p').text().trim(),
          link: $(elm).find($('h3')).find($('a')).attr('href')
        }
        result.push(listing);
        
      });//end cheerio */
      extractData(++page);
    });//end request
  } else {
    //console.log(result);
    fs.appendFileSync('dogs.json', JSON.stringify(result));
    console.log(`Successfully scraped ${page} pages `);
    return result;
  }
}

extractData(page);


