function day() {
        var cellSize = 10;
        
        var rect,
            text,
            hours,
            container;
     
        function my(selection) {
            selection.call(function(d, i) {
                container = d3.select(this).node();
                
                container
                    .attr("class", "day")
                    .attr("width", cellSize)
                    .attr("height", cellSize)
                    .attr("y", function(d) { return d3.time.weekOfYear(d) * cellSize + d3.time.weekOfYear(d) * config.DAYS.SPACE_BETWEEN })
                    .attr("x", function(e) { return e.getDay() * cellSize + e.getDay() * config.DAYS.SPACE_BETWEEN })
                    .attr("transform", function(e, j) {
                            return "translate(" + (e.getDay() * config.DAYS.SPACE_BETWEEN) + ", " + (d3.time.weekOfYear(e) * config.DAYS.SPACE_BETWEEN) + ")";
                    })
                    .attr("pointer-events", "all")
                    // .attr("fill", "white")
                ;
                
                container
                    .append("rect")
                        .attr("height", "100%")
                        .attr("width", "100%")
                        .attr("fill", "white")
                        
                ;
                    
                
                hours = container
                    .append("svg")
                        .attr("height", "70%")
                        .attr("width", "90%")
                        .attr("y", "25%") // 100% - Height% - 5% 
                        .attr("x", "5%")    // 100% - Width% - 5%
                        .attr("fill", "#ccc")
                        .attr("display", "none")
                ;
                
                hours
                    .selectAll(".hour")
                    .data(d3.range(24))
                    .enter()
                    .append("line")
                        .attr("width", "100%")
                        // .attr("height", (100 / 24) + "%")
                        .attr("x1", 0)
                        .attr("x2", "100%")
                        .attr("y1", function(d, i) {
                            return (i * (100 / 24)) + "%";
                        })
                        .attr("y2", function(d, i) {
                            return (i * (100 / 24)) + "%";
                            
                        })
                        .attr("stroke-width", 0.5)
                        .attr("stroke", "black")
                ;
                        
                
                text = container
                    .append("text")
                        .attr("pointer-events", "none")
                        .attr("y", "30")
                        .attr("x", "15")
                        .attr("font-size", "20")
                        .text(function(d) { return moment(d).format("D MMM") })
                ;
                
            });
        }
        
        my.redraw = function() {
                // container
                //     .attr("display", function(d) {
                //         var dayX = this.getScreenCTM().e,
                //             dayY = this.getScreenCTM().f;
                        
                //         if (dayX + cellSize < 0 && dayY + cellSize < 0 || dayX > clientWidth + cellSize && dayX > clientHeight + cellSize) {
                //             // console.log("Hiding: " + moment(d).format("D MMM"));
                //             return "none";
                //         }
                //         // console.log("Showing: " + moment(d).format("D MMM"));
                //         return "visible";
                //         // console.log([this.node().getScreenCTM().e, this.node().getScreenCTM().f]);
                //     })
            
            if (previousZoomLevel !== zoomLevel) {
                switch (zoomLevel) {
                  case ZoomLevel.YEAR:
                      hours.attr("display", "none");
                      break;
                  case ZoomLevel.MONTH:
                      text.text(function(d) { return moment(d).format("D MMM") })
                      hours.attr("display", "none");
                       
                      container.attr("pointer-events", "all");
                      break;
                  case ZoomLevel.DAY:
                      text.text(function(d) { return moment(d).format("D MMM YYYY") })
                      container.attr("pointer-events", "none");
                      hours.attr("display", "visible");
                      break;
                }
            }
        }
    
        my.cellSize = function(value) {
            if (!arguments.length) return cellSize;
            cellSize = value;
            return my;
        };
        
        my.rect = function() {
            return container;
        };
        
        my.children = function() {
            return children;
        };
        
    return my;
}