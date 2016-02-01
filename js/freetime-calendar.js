
function freetimeCalendar() {

    var margin = 5;

    function my(selection) {
        selection.each(function(d, i) {
            var yearsRange = d3.range(moment().format("YYYY"), moment().add(4, "years").format("YYYY"));
            
            var selectionBounds = selection.node().getBoundingClientRect(),
                width = selectionBounds.width * 0.99, // TODO: Remove percentage
                height = selectionBounds.height * 0.98, // TODO: Remove percentage
                // yearWidth = width / yearsRange.length,
                cellSize = Math.min(width / 7) - margin/2; // 53 weeks, because the first/last week can be split
            
            var zoomTranslation = [0, 0],
                zoomScale = 1;
            
            var zoom = d3.behavior.zoom()
                .translate([0, 40])
                .scaleExtent([0.5, 10])
                .on("zoom", zoomed);
            
            selection
                .on("keydown", function() {
                    // if (d3.event.shiftKey) {
                    //     // zoom.on("zoom", null);
                    //     zoom.translate(zoomTranslation).scale(zoomScale).event
                    //     zoom.on("zoom", zoomed);
                    // }
                })
                .on("keyup", function() {
                    // if (d3.event.keyCode === 16) {
                    //     // zoom.translate(zoomTranslation).scale(zoomScale).event
                    //     zoom.on("zoom", null);
                    //     // zoom.on("zoom", zoomed);
                    // }
                })
            ;
            
            var svg = selection
                .append("svg")
                    .attr("class", "container")
                    .attr("width", width)
                    .attr("height", height + (yearsRange.length * margin))
                    
                    .call(zoom) // delete this line to disable free zooming
                    .on("dblclick.zoom", null) // disable zoom in on double-click
                    .append("g")
                        .attr("class", "calendar")
                        .attr("transform", function(e) {
                        return "translate(" + 0 + " ," + 40 + ")";
                    })
            ;
            
            
            var years = svg.selectAll(".year")
                    .data(yearsRange)
                    .enter()
                    .append("g")
                        .attr("class", "year")
                        .attr("id", function(d) { return d; })
                        // .attr("width", cellSize * config.DAYS.NUMBER_OF + config.DAYS.NUMBER_OF * config.DAYS.SPACE_BETWEEN)
                        .attr("transform", function(e, j) {
                            return "translate(" + 
                                    (j * config.DAYS.NUMBER_OF * cellSize + j * config.DAYS.NUMBER_OF * margin) + 
                                    ", " + 0 + 
                                ")"
                        })
            ;
            
            var days = day()
                .cellSize(cellSize)
            ;
            
            years
                .selectAll(".day")
                .data(function(d) {
                    return d3.time.days(moment(new Date(d, 0, 1)), moment(new Date(d + 1, 0, 1))); 
                })
                .enter()
                .append("g")
                    .attr("class", "day")
                    .call(days)
            ;
            
            var selectionRange = {start: null, end: null};
            var centered;
            days.rect()
                .on('mousedown', function(d){
                    if (!d3.event.shiftKey) {
                        selectionRange.start = d;   
                    }
                })
                .on('mouseup', function(d){
                    if (!d3.event.shiftKey) {
                        selectionRange.end = d;
                        console.log(moment.duration(selectionRange.end - selectionRange.start).asDays());
                        
                        selectionRange.start = null;
                        selectionRange.end = null;
                    }
                })
                .on('mouseover', function(d) {
                    d3.select(this).style("fill-opacity", "0.7");
        
                    if (selectionRange.start) {
                        years.selectAll(".day rect")
                            // .call(function(d) {
                            //     console.log(this);
                            // })
                            .each(function(e) {
                                if (selectionRange.start <= e && e <= d) {
                                    d3.select(this).style("fill", "lightblue");
                                } else {
                                    d3.select(this).style("fill", "white");
                                    d3.select(this).style("fill-opacity", "1");
                                }
                            })
                        ;
                    }
                })
                .on('mouseout', function(d){
                    d3.select(this).style("fill-opacity", "1");
                })
                .on('click', function(d, i) {
                    // if (!d3.event.shiftKey) {
                    //     d3.select(this).style("fill", "lightblue");
                    // }
                })
                .on('dblclick', function(d, i){
                    var translate = [0, 0], scale = 1;
                    
                    if (centered !== this) {
                        var bBox = this.getBBox();
                        var parent = d3.select(this.parentNode),
                            parentY = d3.transform(parent.attr("transform")).translate[1],
                            parentX = d3.transform(parent.attr("transform")).translate[0],
                            parentHeight = parent.attr("height");
                        
                        var x = parentX + bBox.x + bBox.width / 2,
                            y = parentY + bBox.y + bBox.height / 2 - 1; // TODO: Find out why the -1
                        
                        scale = 5;
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
            
            // years.selectAll(".month")
            //     .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            //     .enter()
            //     .append("path")
            //         .attr("class", "month")
            //         // .attr("d", monthPath)
            // ;
            
            var x = d3.scale.linear()
                .domain([0, 6])
                .range([0, cellSize * 6]);
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top")
                .ticks(config.DAYS.NUMBER_OF)
                .tickFormat(function(d) { return moment.weekdaysShort(d); })
            ;
            
            var weekAxis = years.append("g")
                .attr("class", "xaxis")
            ;
            
            weekAxis
                .call(xAxis)
                // .attr("height", config.WEEKS.AXIS.HEIGHT)
                .selectAll("text")
                    .attr("text-anchor", "end")
                    .attr("font-size", "20")
                    .attr("y", "0")
                    .attr("alignment-baseline", "text-before-edge")
                    .attr("transform", function(e) {
                        return "translate(" + (cellSize/2 + e * config.DAYS.SPACE_BETWEEN) + ", " + 0 + ")"
                    })
            ;

            weekAxis
                .insert('rect', '.tick')
                    // .attr("height", "30")
                    .attr("height", function(e) {
                        return d3.select(this.parentNode).node().getBBox().height;
                        // return weekAxis.select(".xaxis").node().getBBox().height;
                    })
                    // .attr("y", -config.WEEKS.AXIS.Y_PADDING)
                    .attr("width", function(e) {
                        return d3.select(this.parentNode.parentNode).node().getBBox().width; // Get year's width
                    })
                    .attr("transform", function(d) {
                        return "translate(" + 0  + ", " + -30 + ")"; // TODO: Get padding from somewhere
                    })
                    // .attr("fill", "lightgrey")
                    .attr("fill", "grey")
                    .attr("fill-opacity", "0.7")
            ;            
            
            
            function zoomed() {
                // Save current values
                zoomTranslation = d3.event.translate;
                zoomScale = d3.event.scale;
                
                // console.log("zoom: " + zoomScale);
                
                // Move whole svg
                svg.attr("transform", "translate(" + zoomTranslation + ")scale(" + zoomScale + ")");
                
                // if (zoomScale <= 25) {
                    // Move weekdays axis
                    // console.log("translate: " + -d3.event.translate[1] / d3.event.scale);
                    weekAxis
                        .selectAll("rect")
                            .attr("height", function(d) {
                                var textHeight = d3.select(this.parentNode).select(".tick text").node().getBBox().height;
                                return textHeight;
                            })
                            .attr("transform", function(d) {
                                var textHeight = d3.select(this.parentNode).select(".tick text").node().getBBox().height
                                return "translate(" + 
                                    0 + " ," + 
                                    Math.max(0, -zoomTranslation[1] / zoomScale + textHeight / 2) + 
                                ")";
                            })
                    ;
                    
                    weekAxis
                        .selectAll(".tick text")
                            .attr("transform", function(d) {
                                var textHeight = d3.select(this).node().getBBox().height

                                var currentX = d3.transform(d3.select(this).attr("transform")).translate[0];
                                return "translate(" + 
                                    currentX + " ," + 
                                    Math.max(0, -zoomTranslation[1] / zoomScale + textHeight / 2) + 
                                ")";
                            })
                            .attr("font-size", function(d) {
                                return Math.min(20, 20 / zoomScale);
                            })
                    ;
                // } else if (zoomScale > 25) {
                //     weekAxis
                //         .transition()
                //         .duration(150)
                //             .attr("display", "none");
                    
                //     years
                //         .selectAll("text")
                //             .attr("font-size", "1")
                //     ;
                // }
            }
            
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
        });
    }
    
    
    my.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return my;
    };
    
    return my;
}