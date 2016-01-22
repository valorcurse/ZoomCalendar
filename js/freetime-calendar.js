var yearsRange = d3.range(moment().format("YYYY"), moment().add(4, "years").format("YYYY"));

var width = window.innerWidth * 0.99,
    height = window.innerHeight * 0.90,
    yearHeight = height / yearsRange.length,
    cellSize = Math.min(width / 53) * 0.95; // 53 weeks, because the first/last week can be split

var centered,
    previousTranslation = [0, 0];

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 50])
    .on("zoom", zoomed);

var svg = d3.select("body")
    .append("svg")
        .attr("class", "container")
        .attr("width", width)
        .attr("height", height + (yearsRange.length * 5))
        .call(zoom) // delete this line to disable free zooming
        .on("dblclick.zoom", null) // disable zoom in on double-click
        .append("g")
;

var years = svg.selectAll(".year")
        .data(yearsRange)
        .enter()
        .append("g")
            .attr("class", "year")
            .attr("width", width)
            .attr("height", height / yearsRange.length)
            .attr("transform", function(d, i) {
                var padding = i * 5;
                return "translate(" + 20 + "," + (yearHeight * i + padding + 5) + ")"
            })
;

years.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

// var months = years.selectAll(".month")
    // .data(d3.range())

var days = years.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
;

days.enter()
    .append("text")
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .attr("dy", "12")
    .attr("dx", "3")
    .text(function(d) {return moment(d).format("D");})
;

days.enter()
    .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", "none")
        .attr("fill-opacity", "1")
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .attr("pointer-events", "all")
        .on('mouseover', function(d){
                d3.select(this).style("fill", "blue")
                d3.select(this).style("fill-opacity", "0.7")
            })
        .on('mouseout', function(d){
            d3.select(this).style("fill", "none")
            d3.select(this).style("fill-opacity", "1")
        })
        .on('dblclick', function(d, i){
            var translate = [0, 0], scale = 1;
            
            if (centered !== this) {
                var bBox = this.getBBox();
                var parent = d3.select(this.parentNode),
                    parentY = d3.transform(parent.attr("transform")).translate[1],
                    parentX = d3.transform(parent.attr("transform")).translate[0],
                    parentHeight = parent.attr("height");
                
                var x = (parentX + bBox.x) + bBox.width / 2,
                    y = parentY + bBox.y + bBox.height / 2 - 1; // TODO: Find out why the -1
                
                scale = 8;
                translate = [width / 2 - scale * x, height / 2 - scale * y];
                centered = this;
            } else {
                scale = 1;
                translate = [0, 0];
                centered = null;
            }

            svg.transition()
                .duration(750)
                .call(zoom.translate(translate).scale(scale).event);
        })
;

function zoomed() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

years.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter()
    .append("path")
        .attr("class", "month")
        // .attr("pointer-events", "all")
        .attr("d", monthPath)
        // .on('mouseover', function(d){
        //     d3.select(this).style("fill", "blue")
        //     d3.select(this).style("fill-opacity", "0.7")
        // })
        // .on('mouseout', function(d){
        //     d3.select(this).style("fill", "none")
        //     d3.select(this).style("fill-opacity", "1")
        // })
        // .on('dblclick', function(d){
        //     var translate = [0, 0], scale = 1;
            
        //     if (centered !== this) {
        //         previousTranslation = zoom.translate();
                    
        //         var bBox = this.getBBox();
        //         var parent = d3.select(this.parentNode),
        //             parentY = d3.transform(parent.attr("transform")).translate[1],
        //             parentHeight = parent.attr("height");
                
        //         var x = bBox.x + bBox.width / 2,
        //             y = parentY + parentHeight / 2;
                
        //         scale = 4;
        //         translate = [width / 2 - scale * x, height / 2 - scale * y];
                
        //         centered = this;
        //     } else {
        //         scale = 1;
        //         translate = [0, 0];
        //         centered = null;
        //     }

        //     svg.transition()
        //         .duration(750)
        //         .call(zoom.translate(translate).scale(scale).event);
        // })
;

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}