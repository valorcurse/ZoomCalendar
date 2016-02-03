
function freetimeCalendar() {

    var margin = 5;
    
         
    var clientWidth = d3.select("body").node().offsetWidth, 
        clientHeight = d3.select("body").node().offsetHeight;
        
    
    function my(selection) {
        selection.each(function(d, i) {
            var yearsRange = d3.range(moment().format("YYYY"), moment().add(1, "years").format("YYYY"));
            
            var selectionBounds = selection.node().getBoundingClientRect(),
                width = selectionBounds.width * 0.99, // TODO: Remove percentage
                height = selectionBounds.height * 0.98, // TODO: Remove percentage
                cellSize = Math.min(width / 7) - margin/2; // 53 weeks, because the first/last week can be split
            
            var zoomTranslation = [0, 0],
                zoomScale = 1;
            
            var zoom = d3.behavior.zoom()
                .translate([0, 40])
                .scaleExtent([0.5, 5])
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
            
            var div = selection
                .append("div")
            ;
            
            var svg = div
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
                                ")";
                        })
            ;
            
            var months = years
                // .selectAll(".month")
                .selectAll("g")
                .data(d3.range(0, 12))
                .enter()
                .append("g")
                    .attr("class", "month")
                    .attr("id", function(d) { return d; })
            ;

            var days = day()
                .cellSize(cellSize)
            ;
            
            months
                .selectAll(".day")
                .data(function(d) {
                    var year = d3.select(this.parentNode.parentNode).data()[0],
                         month = d3.select(this.parentNode).data()[0],
                         currentDate = new Date(year, month);
                         
                    return d3.time.days(moment(currentDate).startOf("month"), moment(currentDate).endOf("month"));
                })
                .enter()
                    .append("svg")
                    .call(days)
            ;

            months
                .attr("x", function(d) { return this.getBBox().x; })
                .attr("y", function(d) { return this.getBBox().y; })
                .attr("width", function(d) { return this.getBBox().width; })
                .attr("height", function(d) { return this.getBBox().height; })
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
                    console.log([this.getScreenCTM().e, this.getScreenCTM().f]);

                    // console.log(d3.event.pageX);
                    // console.log(this.getScreenCTM().e);
                    // console.log(this.getScreenCTM().e)
                    // console.log(svg.node().getScreenCTM().e);
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
                        
                        scale = 3.5;
                        translate = [width / 2 - scale * x - 5 * scale, height / 2 - scale * y - 5 * scale];
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
            
            // console.log(days);
            
            // days.children()
            //     .append("rect")
            //         .attr("fill", "blue")
                    // .attr("height", "inherit")
                    // .attr("width", "inherit")
            // ;
            
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
                .call(xAxis)
            ;
            
            weekAxis
                .selectAll("text")
                    .attr("text-anchor", "end")
                    .attr("font-size", "20")
                    .attr("y", "0")
                    .attr("alignment-baseline", "after-edge")
                    .attr("transform", function(d) {
                        return "translate(" + (cellSize/2 + d * config.DAYS.SPACE_BETWEEN) + ", " + 0 + ")";
                    })
            ;

            weekAxis
                .insert('rect', '.tick')
                    .attr("width", function(e) {
                        return d3.select(this.parentNode.parentNode).node().getBBox().width; // Get year's width
                    })
                    .attr("fill", "lightgrey")
                    .attr("fill-opacity", "0")
            ;            
            
            // var previousZoomLevel = zoomLevel;
            function zoomed() {
                // Save current values
                zoomTranslation = [d3.event.translate[0], d3.event.translate[1]];
                zoomScale = d3.event.scale;
                
                // console.log(d3.event.sourceEvent.pageX);
                
                if (ZoomLevel.MONTH > zoomScale && zoomScale >= ZoomLevel.YEAR) {
                    zoomLevel = ZoomLevel.YEAR;
                }
                else if (ZoomLevel.DAY > zoomScale && zoomScale >= ZoomLevel.MONTH) {
                    zoomLevel = ZoomLevel.MONTH;
                }
                else if (ZoomLevel.DAY >= zoomLevel) {
                    zoomLevel = ZoomLevel.DAY;
                }
                
                // Move whole svg
                // svg.attr("transform", "translate(" + zoomTranslation + ")scale(" + zoomScale + ")");
                svg.style("transform", "translate(" + zoomTranslation[0] + "px, " + zoomTranslation[1] + "px)scale(" + zoomScale + ")");
                
                weekAxis
                .selectAll("rect")
                    .attr("height", function(d) {
                        var textHeight = 20 / zoomScale;
                        return textHeight;
                    })
                    .attr("transform", function(d) {
                        var textHeight = 20 / zoomScale;
                        return "translate(" + 
                            0 + " ," + 
                            Math.max(-textHeight, -zoomTranslation[1] / zoomScale ) + 
                        ")";
                    })
                    .transition()
                    .duration(250)
                        .attr("fill-opacity", function(d) {
                            if (-d3.event.translate[1] / d3.event.scale <= -10) {
                                return "0";
                            } else {
                                return "0.7";
                            }
                        })
                ;
                
                weekAxis
                    .selectAll(".tick text")
                        .attr("transform", function(d) {
                            var textHeight = 20 / zoomScale;

                            var currentX = d3.transform(d3.select(this).attr("transform")).translate[0];
                            return "translate(" + 
                                currentX + " ," + 
                                Math.max(0, -zoomTranslation[1] / zoomScale + textHeight) + 
                            ")";
                        })
                        .attr("font-size", function(d) {
                            return Math.min(20, 20 / zoomScale);
                        })
                ;
                    
                months
                    .each(function(d, i) {
                        
                        var month = d3.select(this);
                        var bbox = {
                            "x": parseInt(month.attr("x")), 
                            "y": parseInt(month.attr("y")), 
                            "width": parseInt(month.attr("width")), 
                            "height": parseInt(month.attr("height"))
                        },
                            x = -(this.getCTM().e) / zoomScale,
                            y = -(this.getCTM().f / zoomScale);
                        
                        if (x > bbox.x + bbox.width    ||
                            y > bbox.y + bbox.height    ||
                            x + clientWidth / zoomScale < bbox.x    ||
                            y + clientHeight / zoomScale < bbox.y) 
                        {
                            d3.select(this).attr("display", "none");
                        } else {
                            d3.select(this).attr("display", "visible");
                        }
                    });
                    
                    days.redraw();
                    
                    previousZoomLevel = zoomLevel;
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
            
            function isOnScreen(element) {
                console.log(element.parentNode);
                
                var bbox = element.getBBox(),
                    x = -(element.getCTM().e) / zoomScale,
                    y = -(element.getCTM().f / zoomScale);
                
                // console.log(element.id + " ------------------------- ");
                // console.log(element.id + " - y ");
                // console.log(element.id + " - " + (y) + " > "+ (bbox.y + bbox.height) + " = " + (y > bbox.y + bbox.height));
                // console.log(element.id + " - " + (y + clientHeight) + " < "+ (bbox.y) + " = " + (y + clientHeight < bbox.y));
                // // console.log(element.id + " ------------------------- ");
                
                // console.log(element.id + " - x ");
                // console.log(element.id + " - " + (x) + " > "+ (bbox.x + bbox.width) + " = " + (x > bbox.x + bbox.width));
                // console.log(element.id + " - " + (x + clientWidth) + " < "+ (bbox.x) + " = " + (x + clientWidth < bbox.x));
                    
                 if (x > bbox.x + bbox.width    ||
                    y > bbox.y + bbox.height    ||
                    x + clientWidth / zoomScale < bbox.x    ||
                    y + clientHeight / zoomScale < bbox.y)
                {
                    // console.log(element.id + " - outside ");
                    // console.log(element.id + " ------------------------- ");
                    return false;
                }
                
                // console.log(element.id + " - inside ");
                // console.log(element.id + " ------------------------- ");
                return true;
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