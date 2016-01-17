var width = 600,
    height = 400,
    cellSize = 50; // cell size

var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

// console.log(moment().daysInMonth())

var svg = d3.select("body")
	// .selectAll("svg")
    // .data(d3.range(moment().daysInMonth()))
    // .data(d3.range(1990, 2011))
  	// .enter()
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    // .attr("class", "RdYlGn")
  .append("g");
    // .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

// svg.append("text")
//     .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
//     .style("text-anchor", "middle")
//     .text(function(d) { return d; });

// var cellSize = moment().daysInMonth() 
console.log(Math.floor(5 / Math.floor(width / cellSize)));
var maxDaysInRow = Math.floor(width / cellSize);
var days = svg
	// .selectAll(".month")
    // .data(function(d) {
    // 	return d3.time.days(moment(), moment());
    // 		// new Date(moment.localeData().monthsParse(d), 0, 1), 
    // 		// new Date(moment.localeData().monthsParse(d) + 1, 0, 1)); 
    // })
	.selectAll("day")
	.data(d3.range(1, moment().daysInMonth()))
 ;

days
  	.enter()
  	.append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d % maxDaysInRow * cellSize - cellSize; })
    .attr("y", function(d) { return Math.floor(d / maxDaysInRow) * cellSize; })
    .attr("stroke", "rgb(255, 0, 0)")
    .attr("fill", "rgb(255, 255, 255)")
;

days
	.enter()
	.append("text")
	.attr("x", function(d) { return d % maxDaysInRow * cellSize - cellSize; })
    .attr("y", function(d) { return Math.floor(d / maxDaysInRow) * cellSize; })
    .attr("dy", cellSize - 5)
    .attr("dx", 5)
    .text(function(d) { return d; });
	
	// .attr("color", "black")
 //    .style("text-anchor", "middle")
	// .text(function(t) {
	// 	return t;
	// });

// fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)
// rect.append("title")
//     .text(function(d) { return d; });

// svg.selectAll(".month")
//     .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
//   .enter().append("path")
//     .attr("class", "month")
//     .attr("d", monthPath);

// function monthPath(t0) {
//   var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
//       d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
//       d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
//   return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
//       + "H" + w0 * cellSize + "V" + 7 * cellSize
//       + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
//       + "H" + (w1 + 1) * cellSize + "V" + 0
//       + "H" + (w0 + 1) * cellSize + "Z";
// }

// d3.select(self.frameElement).style("height", "2910px");