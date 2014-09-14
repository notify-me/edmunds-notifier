var express = require('express');
var bodyParser = require('body-parser');
var request = require('superagent');

var counts = [];

function requests() {
  request.get('https://api.edmunds.com/api/vehicle/v2/makes/count?state=used&year=2005&view=basic&fmt=json&api_key=b4gw6jge42v92wcv9xy6bm3p', 
    function(error, res){
      if (!error && res.status == 200) {
        response = res.text["makeCounts"];

        if(counts[1] && response > counts[1]) {
          counts[0] = counts[1];
          counts[1] = response;
          request
           .post('http://buddhabrudda.mybluemix.net/notifications/4699553379')
           .send({ text: 'New car count is '+counts[1]})
           .set('Accept', 'application/json')
           .end(function(res){
             if (res.ok) {
              alert('yay got ' + JSON.stringify(res.body));
             } else {
              alert('Oh no! error ' + res.text);
             }
          });
        }
        else {
          counts.push(res.text);  
        }
      }
      else {
        console.log(err);
      }
      setInterval(requests(), 0);
    }
  );
}