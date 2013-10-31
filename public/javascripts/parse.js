if (typeof moment == 'undefined') {
  moment = require('moment');
}

function iterate (sentence, type, fn, next) {
  var retcount = 0;
  do {
    retcount = 0;
    for (var i = 0; i < sentence.ranges.length; i++) {
      if (sentence.ranges[i].type == null) {
        var ret = fn(sentence.ranges[i]);
        if (ret) {
          retcount++;
          var left = sentence.ranges[i].text.substr(0, ret.index);
          var right = sentence.ranges[i].text.substr(ret.index + ret[0].length);
          sentence.ranges.splice(i, 1, {
            type: null,
            text: left
          }, {
            type: type,
            text: ret[0]
          }, {
            type: null,
            text: right
          });
          i++;
          continue;
        }
      }
    }
  } while (retcount > 0);
  sentence.ranges = sentence.ranges.filter(function (r) {
    return r.text;
  })
  next();
}

function identifyDays (sentence, next) {
  iterate(sentence, 'day', function (str) {
    var ret, regex = /\b(?:(this(?:\s+(?:up?)coming)?|next)?\s+)?(mon(?:day)?|tues?(?:day)?|wed(?:nesday)?|thurs?(?:day)?|fri(?:day)?|sat(?:ur)?(?:day)?|sun(?:day)?|today|tomorrow|yesterday)\b/i;
    if (ret = regex.exec(str.text)) {
      // console.log(ret);
      // sentence.day = {
      //   day: str.text,
      //   nextweek: ret[1] == 'this',
      //   number: ret[3] && parseInt(ret[3]) 
      // };
      // return text.split(regex, 2);
      return ret;
    }
    var ret, regex = /\s*\b(\d\d?(?:nd|st|rd|th)?)\b/i;
    if (ret = regex.exec(str.text)) {
      // console.log(ret);
      // sentence.day = {
      //   day: str.text,
      //   nextweek: ret[1] == 'this',
      //   number: ret[3] && parseInt(ret[3]) 
      // };
      // return text.split(regex, 2);
      return ret;
    }
  }, next);
}

function identifyDates (sentence, next) {
  iterate(sentence, 'month', function (str) {
    var ret, regex = /\b(?:(?:from|until|starting|on|to|[-—–]+)\b\s*)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|Sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i;
    if (ret = regex.exec(str.text)) {
      // sentence.date = {
      //   month: ret[1],
      //   number: ret[2] && parseInt(ret[2])
      // };
      // return text.split(regex, 2);
      return ret;
    }
  }, next);
}

function identifyHours (sentence, next) {
  iterate(sentence, 'hour', function (str) {
    var ret, regex = /\ball\s+day\b/i;
    if (ret = regex.exec(str.text)) {
      // sentence.hours = {start: 0, end: 24*60*60}
      // return text.split(regex, 2);
      return ret;
    }
    var regex = /\s*\b(?:(?:at|from|starting|to|[-–—]+|until)\b\s*)?(\d+(?::\d+)?\s*(?:p\.?m\.?|a\.?m\.?)?|noon|midnight|midnite)\b/ig;
    if (ret = regex.exec(str.text)) {
      // sentence.hours = {start: ret[2] + (ret[3] || (ret[2].match(/^\d/) ? ret[6] || 'pm' : '')), end: ret[5] + (ret[6] || (ret[5].match(/^\d/) ? ret[2] || 'pm' : ''))}
      return ret;
    }
  }, next);
}

function identifyHolidays (sentence, next) {
  iterate(sentence, 'holiday', function (str) {
    var ret, regex = /\b(memorial\s*day)\b/i;
    if (ret = regex.exec(str.text)) {
      // sentence.hours = {start: 0, end: 24*60*60}
      // return text.split(regex, 2);
      return ret;
    }
  }, next);
}

function identifyRepeat (sentence, next) {
  iterate(sentence, 'repeat', function (str) {
    var ret, regex = /\bevery\s+day\b/i;
    if (ret = regex.exec(str.text)) {
      // sentence.hours = {start: 0, end: 24*60*60}
      // return text.split(regex, 2);
      return ret;
    }
  }, next);
}

function interpret (sentence, next) {
  var event = {
    date: { start: null, end: null },
    hours: { start: null, end: null },
    repeat: null
  };
  sentence.event = event;

  for (var i = 0; i < sentence.ranges.length; i++) {
    if (sentence.ranges[i].type == 'month' && sentence.ranges[i+1] && sentence.ranges[i+1].type == 'day' && sentence.ranges[i+1].text.match(/^\s*\d/)) {
      sentence.ranges[i].text += ' ' + sentence.ranges[i+1].text;
      sentence.ranges.splice(i + 1, 1);
    }
  }

  var description = [];

  sentence.ranges.forEach(function (range) {
    if (range.type == 'month' || range.type == 'day') {
      if (!event.date.start || range.text.match(/(from|starting)/i)) {
        event.date.start = range.text.replace(/\b(from|to|until|at|on)\b/i, '');
      } else if (range.text.match(/(until|to)/i)) {
        event.date.end = range.text.replace(/\b(from|to|until|at|on)\b/i, '');
      }
    }
    if (range.type == 'hour') {
      if (range.text.match(/all\s+day/i)) {
        event.hours.start = '12AM'
        event.hours.end = '11:59PM'
      } else if (!event.hours.start || range.text.match(/(from|starting)/i)) {
        event.hours.start = range.text.replace(/\b(from|to|until|at|on)\b/i, '').replace(/^\s+|\s+$/, '');
      } else if (range.text.match(/(until|to)/i)) {
        event.hours.end = range.text.replace(/\b(from|to|until|at|on)\b/i, '').replace(/^\s+|\s+$/, '');
      }
    }
    if (range.type == 'repeat') {
      event.repeat = range.text;
    }
    if (range.type == null) {
      description.push(range.text);
    }
  });

  // Parse the start and end times of the event.
  var start = moment(event.hours.start, 'ha');
  var end = event.hours.end ? moment(event.hours.end, 'ha') : moment(start).add('hours', 1);
  console.log(event.hours.start, start.format());
  // Reconstitute the hours involved.
  var starthours = start.hours();
  var endhours = end.hours();
  if (endhours < starthours) {
    endhours += 12;
  }
  event.startdate = (function () { var a = new Date(); a.setHours(starthours); return a; })();
  event.enddate = (function () { var a = new Date(); a.setHours(endhours <= starthours ? starthours + 1 : endhours); return a; })();

  event.description = description.join(' ');
  event.description.match(/^\s+/) && (event.description = 'New event');
  next();
}

function parseAll (str, next) {
  // str.replace(/\s+/g, ' ');

  // TODO Remove whitespace between numbers and times

  var sentence = {
    ranges: [
      {
        type: null,
        text: str
      }
    ]
  };

  identifyHolidays(sentence, function () {
    identifyHours(sentence, function () {
      identifyDates(sentence, function () {
        identifyDays(sentence, function () {
          identifyRepeat(sentence, function () {
            interpret(sentence, function () {
              next(sentence);
            })
          })
        })
      });
    });
  })
}

if (typeof exports !== 'undefined') {
  exports.parseAll = parseAll;
}

  // var tokenizer = new natural.WordTokenizer();
  // var tokens = tokenizer.tokenize(str);

  // .forEach(function (token) {
  //   // console.log(token);
  //   // chronic(token, function (err, date, str) {
  //   //   if (!err) {
  //   //     console.log(err, date, token);
  //   //   }
  //   // })
  // })

// function identifyHolidays (str, next) {
//   var holidays = ['memorial day'];
//   next(null, holidays.reduce(function (str, cur) {
//     return str.replace(new RegExp('\\b(' + escape(cur) + ')\\b', 'gi'), '<HOLIDAY>$1</HOLIDAY>');
//   }, str));
// }