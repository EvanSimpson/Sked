Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var width = 960,
	height = 120,
	cellWidth = 137,
	cellHeight = 110,
	cellSize = 100;

var day = d3.time.format("%w"),
	week = d3.time.format("%U"),
	percent = d3.format(".1%"),
	format = d3.time.format("%Y-%m-%d");

var svg = d3.select("body").selectAll("svg")
	.data(d3.range(1,52))
	.enter().append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "sked")
	.append("g");

var rect = svg.selectAll(".day")
	.data(function(d) {return d3.time.days(new Date(firstDayOfWeek(d, 2013).toISOString()), new Date(firstDayOfWeek(d, 2013).addDays(7).toISOString())); })
	.enter().append("rect")
	.attr("class", "day")
    .attr("width", cellWidth)
    .attr("height", cellHeight)
    .attr("x", function(d,i) {return i * cellWidth})
    .datum(format);

rect.append("text")
	.text(function(d) {return d;});

var dateNum = svg.selectAll("text")
	.data(function(d) {return d3.time.days(new Date(firstDayOfWeek(d, 2013).toISOString()), new Date(firstDayOfWeek(d, 2013).addDays(7).toISOString())); })
	.enter().append("text");

var textLabels = dateNum
	.attr("x", function(d,i) { return i * cellWidth; })
	.attr("y", function(d) { return 20; })
	.text( function(d) { return d; })
	.attr("font-family", "sans-serif")
	.attr("font-size", "20px")
	.attr("fill", "red");

// d3.csv("/javascripts/dji.csv", function(error, csv) {
//   var data = d3.nest()
//     .key(function(d) { return d.Date; })
//     .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
//     .map(csv);

//   rect.filter(function(d) { return d in data; })
//       .attr("class", function(d) { return "day " + color(data[d]); })
//     .select("title")
//       .text(function(d) { return d + ": " + percent(data[d]); });
// });

d3.json("/javascripts/data.json", function(error, json){
	var data = d3.nest()
		.key(function(d){return d.startTime})
		.map(json.events);	

	rect.filter(function(d) {return d in data;})
		.attr("class", function(d) {return "day q10-11"});
});

// function monthPath(t0) {
// 	var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
// 		d0 = +day(t0), w0 = +week(t0),
// 		d1 = +day(t1), w1 = +week(t1);
// 	return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
// 		+ "H" + w0 * cellSize + "V" + 7 * cellSize
// 		+ "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
// 		+ "H" + (w1 + 1) * cellSize + "V" + 0
// 		+ "H" + (w0 + 1) * cellSize + "Z";
// }

d3.select(self.frameElement).style("height", "2910px");

