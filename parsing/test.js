// npm install rem escape-regexp crutch natural
// gem install chronic

  var fs = require('fs')

var samples = fs.readFileSync('./sample.txt', 'utf8').split('\n').filter(String).map(JSON.parse);



var parse = require('./parse');

samples.forEach(function (sample) {

  parse.parseAll(sample.input, function (sentence) {
    // console.log('------');
    console.log('ORIGINAL STRING:', sample.input);
    console.log('RANGES: ', sentence.ranges);
    console.log('SENTENCE:', sentence.event);
    console.log('-------');
  });

  // identifyRanges(str, function (err, str) {
    // identifyTimeWords(sentence, function (err, str) {
      // console.log(sentence);
    // });
  // })

  // Make Text Processing request.
  // str = str.replace(/\s+([ap]m)\b/ig, '$1');
  // rem.json('http://text-processing.com/api/phrases/').post('form', {
  //   text: str
  // }, function (err, json) {
  //   console.log(json);
  // });
});