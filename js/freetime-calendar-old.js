// var width = 800,
    // height = 600,
var width = window.innerWidth * 0.9,
    height = window.innerHeight * 0.9,
    monthsInRow = 4;
    daysInRow = 8,
    monthSize = width / monthsInRow,
    daySize = 50;
    
var year = moment().format("YYYY")

var svg = d3.select("body")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var year = svg
    // .selectAll("year")
    // .data(d3.range(year, year))
    // .enter()
    .append("g")
        .append("rect")
            .attr("class", "year")
            .attr("width", width)
            .attr("height", height)
            .attr("stroke", "rgb(0, 0, 255)")
            .attr("fill", "rgb(255, 255, 255)")
;



function xMonthPosition(month) {
    var monthSize = width / monthsInRow;
    return month % monthsInRow * monthSize;
}

function yMonthPosition(month) {
    var monthSize = height / (12 / monthsInRow);
    return Math.floor(month / (monthsInRow)) * monthSize;
}

var months = svg.selectAll("months")
    .data(d3.range(0, 12))
    .enter()
    .append("g")
        .append("rect")
            .attr("class", "month")
            .attr("width", width / monthsInRow)
            .attr("height", height / (12 / monthsInRow))
            .attr("x", xMonthPosition)
            .attr("y", yMonthPosition)
            .attr("stroke", "rgb(0, 255, 0)")
            .attr("fill", "rgb(255, 255, 255)")
;

var days = svg.selectAll("day")
// 	.data(d3.range(1, moment().daysInMonth()))
	.data(d3.time.days(moment(), moment().endOf("year")))
 ;

function xDayPosition(day) {
    console.log(moment(day).format("M") + " -> " + xMonthPosition(moment(day).format("M")));
    return xMonthPosition(moment(day).format("M")) + moment(day).format("D") % daysInRow * daySize - daySize;
    // return day % maxDaysInRow * daySize - daySize;
}

function yDayPosition(day) {
     return Math.floor(moment(day).format("D") / daysInRow) * daySize;
}

days.enter()
    .append("rect")
        .attr("class", "day")
        .attr("width", daySize)
        .attr("height", daySize)
        .attr("x", xDayPosition)
        .attr("y", yDayPosition)
        .attr("stroke", "rgb(255, 0, 0)")
        .attr("fill", "rgb(255, 255, 255)")
;

// days.enter()
// 	.append("text")
//         .attr("x", xDayPosition)
//         .attr("y", yDayPosition)
//         .attr("dy", daySize - 5)
//         .attr("dx", 5)
//         .text(function(d) { return d; })
// ;