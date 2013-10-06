function firstDayOfWeek(week, year) {

    if (typeof year !== 'undefined') {
        year = (new Date()).getFullYear();
    }

    var date       = firstWeekOfYear(year),
        weekTime   = weeksToMilliseconds(week),
        targetTime = date.getTime() + weekTime - 86400000;

    var result = new Date(targetTime)

    return result; 
}

function weeksToMilliseconds(weeks) {
    return 1000 * 60 * 60 * 24 * 7 * (weeks - 1);
}

function firstWeekOfYear(year) {
    var date = new Date();
    date = firstDayOfYear(date,year);
    date = firstWeekday(date);
    return date;
}

function firstDayOfYear(date, year) {
    date.setYear(year);
    date.setDate(1);
    date.setMonth(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function firstWeekday(date) {

    var day = date.getDay(),
        day = (day === 0) ? 7 : day;

    if (day > 3) {

        var remaining = 8 - day,
            target    = remaining + 1;

        date.setDate(target);
    }

    return date;
}