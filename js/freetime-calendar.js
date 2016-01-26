
function freetimeCalendar() {

    var margin = 5;

    function my(selection) {
        selection.each(function(d, i) {
            var yearsRange = d3.range(moment().format("YYYY"), moment().add(4, "years").format("YYYY"));
            
            // console.log(selection);
            
            var selectionBounds = selection.node().getBoundingClientRect(),
                width = selectionBounds.width * 0.99, // TODO: Remove percentage
                height = selectionBounds.height * 0.98, // TODO: Remove percentage
                yearHeight = height / yearsRange.length,
                cellSize = Math.min(width / 53) * 0.95; // 53 weeks, because the first/last week can be split
            
            var centered,
                previousTranslation = [0, 0];
            
            var zoomTranslation = [0, 0],
                zoomScale = 1;
            
            var zoom = d3.behavior.zoom()
                .translate([0, 0])
                .scale(1)
                .scaleExtent([1, 50])
                .on("zoom", zoomed);
            
            selection
                .on("keydown", function() {
                    if (d3.event.shiftKey) {
                        zoom.on("zoom", null);
                    }
                })
                .on("keyup", function() {
                    if (d3.event.keyCode === 16) {
                        zoom.translate(zoomTranslation).scale(zoomScale).event
                        zoom.on("zoom", zoomed);
                    }
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
            ;
            
            
            var years = svg.selectAll(".year")
                    .data(yearsRange)
                    .enter()
                    .append("g")
                        .attr("class", "year")
                        .attr("id", function(d) { return d; })
                        .attr("width", width)
                        .attr("height", height / yearsRange.length)
                        .attr("transform", function(d, i) {
                            return "translate(" + 50 + "," + (i * yearHeight + i * margin + margin) + ")"
                        })
            ;
            
            // var weekAxis = years.append("g")
            //     .attr("class", "y axis")
            //     .attr("transform", "translate(-10, " + (-cellSize/2 - 3) + ")")
            //     // .call(yAxis)
            // ;
            
            // weekAxis
            //     .call(yAxis)
            //     .selectAll("text")  
            //         .style("text-anchor", "middle")
            //         .attr("transform", function(d) {
            //             return "rotate(-90)" 
            //         });
                    
            years.append("text")
                .attr("transform", "translate(-20," + cellSize * 3.5 + ")rotate(-90)")
                .style("text-anchor", "middle")
                .text(function(d) { return d; });
            
            
            // TODO: Add later
            // var months = years.selectAll(".month")
            //     .data(d3.range(1, 13))
            //     .enter()
            //     .append("g")
            //         // .attr("class", "month")
            //         .attr("id", function(d) { return d; })
            // ;
            
            // var weeks = months.selectAll(".week")
            //     .data(d3.range(1, 53))
            //     .enter()
            //     .append("g")
            //         .attr("class", "week")
            //         .attr("id", function(d) { return d; })
            // ;
                
            
                
            var days = years.selectAll(".day")
                .data(function(d) { return d3.time.days(moment(new Date(d, 0, 1)), moment(new Date(d + 1, 0, 1))); })
                .enter()
                // .call(day)
                .append(function(d) { return day(d, cellSize)})
                // .append("g")
                    // .attr("class", "day")
            ;
            
            // var selectionRange = {start: null, end: null};
            // days
            //     .append("rect")
            //         .attr("width", cellSize)
            //         .attr("height", cellSize)
            //         .attr("fill", "none")
            //         .attr("fill-opacity", "1")
            //         .attr("x", function(d, i) { return d3.time.weekOfYear(d) * cellSize; })
            //         .attr("y", function(d, i) { return d.getDay() * cellSize; })
            //         .attr("pointer-events", "all")
            //         .on('mousedown', function(d){
            //             if (d3.event.shiftKey) {
            //                 // console.log(d);
            //                 selectionRange.start = d;   
            //             }
            //         })
            //         .on('mouseup', function(d){
            //             if (d3.event.shiftKey) {
            //                 selectionRange.end = d;
            //                 console.log(moment.duration(selectionRange.end - selectionRange.start).asDays());
                            
            //                 selectionRange.start = null;
            //                 selectionRange.end = null;
            //             }
            //         })
            //         .on('mouseover', function(d) {
            //             d3.select(this).style("fill-opacity", "0.7")

            //             if (selectionRange.start && d3.event.shiftKey) {
            //                 years.selectAll(".day")
            //                     .each(function(e) {
            //                         if (selectionRange.start <= e && e <= d) {
            //                             d3.select(this).style("fill", "lightblue")
            //                         } else {
            //                             d3.select(this).style("fill", "white")
            //                             d3.select(this).style("fill-opacity", "1")
            //                         }
            //                     })
            //                 ;
            //             }
            //         })
            //         .on('mouseout', function(d){
            //             d3.select(this).style("fill-opacity", "1")
            //         })
            //         .on('click', function(d, i) {
            //             d3.select(this).style("fill", "lightblue");
            //         })
            //         .on('dblclick', function(d, i){
            //             var translate = [0, 0], scale = 1;
                        
            //             if (centered !== this) {
            //                 var bBox = this.getBBox();
            //                 var parent = d3.select(this.parentNode),
            //                     parentY = d3.transform(parent.attr("transform")).translate[1],
            //                     parentX = d3.transform(parent.attr("transform")).translate[0],
            //                     parentHeight = parent.attr("height");
                            
            //                 var x = (parentX + bBox.x) + bBox.width / 2,
            //                     y = parentY + bBox.y + bBox.height / 2 - 1; // TODO: Find out why the -1
                            
            //                 scale = 25;
            //                 translate = [width / 2 - scale * x, height / 2 - scale * y];
            //                 centered = this;
            //             } else {
            //                 scale = 1;
            //                 translate = [0, 0];
            //                 centered = null;
            //             }
            
            //             svg.transition()
            //                 .duration(750)
            //                 .call(zoom.translate(translate).scale(scale).event);
            //         })
            // ;
            
            // days
            //     .append("text")
            //         .attr("pointer-events", "none")
            //         .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
            //         .attr("y", function(d) { return d.getDay() * cellSize; })
            //         .attr("dy", "12")
            //         .attr("dx", "3")
            //         .text(function(d) {return moment(d).format("D");})
            // ;
            
            years.selectAll(".month")
                .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                .enter()
                .append("path")
                    .attr("class", "month")
                    .attr("d", monthPath)
            ;
            
            var y = d3.scale.linear()
                .domain([0, 6])
                .range([0, cellSize * 6]);
            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(7)
                .tickFormat(function(d) { return moment.weekdaysShort(d); })
                .tickSize(cellSize)
            ;
            
            var weekAxis = years.append("g")
                .attr("class", "yaxis")
                .attr("transform", "translate(-10, " + (-cellSize/2 - 3) + ")")
                // .attr("fill", "black")
                // .call(yAxis)
            ;
            
            weekAxis
                .append('rect')
                .attr("width", "20")
                .attr("height", cellSize * 7)
                .attr("transform", function(d) {
                        return "translate(" + -10  + ", " + 17 + ")"; // TODO: Get padding from somewhere
                    })
                .attr("fill", "lightgrey")
                .attr("fill-opacity", "0")
                
            ;
            
            weekAxis
                .call(yAxis)
                .selectAll("text")
                    .style("text-anchor", "middle")
                    .attr("font-size", "10")
                    .attr("transform", function(d) {
                        return "rotate(-90)" 
                    });
            
            
            
            function zoomed() {
                // Save current values
                zoomTranslation = d3.event.translate;
                zoomScale = d3.event.scale;
                
                // console.log("zoom: " + zoomScale);
                
                // Move whole svg
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                
                if (zoomScale <= 25) {
                    // Move weekdays axis
                    weekAxis
                        .attr("transform", function(d) {
                            return "translate(" + Math.max(-10, -d3.event.translate[0] / d3.event.scale - 45) + "," + (-cellSize/2 - 3) + ")";
                        })
                        .selectAll("rect")
                            .transition()
                            .duration(150)
                                .attr("fill-opacity", function(d) {
                                    if (-d3.event.translate[0] / d3.event.scale - 45 <= -10) {
                                        return "0";
                                    } else {
                                        return "0.95";
                                    }
                                })
                                // .attr("width", function(d) {
                                //     var currentWidth = d3.select(this).node().getBBox().width;
                                //     // console.log(d3.select(this).node());
                                //     // console.log(zoomScale / zoom.scaleExtent()[1]);
                                //     // return d3.select(this).
                                //     return currentWidth * (1 - zoomScale / zoom.scaleExtent()[1]);
                                // })
                                // .attr("font-size", function(d) {
                                    
                                //     var currentSize = Math.max(d3.select(this).attr("font-size"), 1),
                                //         zoomLevel = (1 - zoomScale / zoom.scaleExtent()[1]);
                                    
                                //     console.log(Math.round(currentSize * zoomLevel));    
                                    
                                //     return Math.round(10 * zoomLevel);
                                // })
                    ;
                    
                     weekAxis
                        .selectAll("text")
                            .attr("font-size", "10")
                    ;
                } else if (zoomScale > 25) {
                    weekAxis
                        .transition()
                        .duration(150)
                            .attr("display", "none");
                    
                    years
                        .selectAll("text")
                            .attr("font-size", "1")
                    ;
                    //     .selectAll("rect")
                    //         .transition()
                    //         .duration(150)
                    //             .attr("fill-opacity", "0")
                    // ;
                    
                    // weekAxis
                    //     .selectAll("text")
                    //         .attr("font-size", "5")
                    // ;
                }
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