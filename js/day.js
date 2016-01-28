function day() {
        var cellSize = 10;
        
        var rect,
            text;
        
        function my(selection) {
            selection.call(function(d, i) {
                var container = d3.select(this).node();
                
                rect = container.append("rect")
                    .attr("width", cellSize)
                    .attr("height", cellSize)
                    .attr("fill", "none")
                    .attr("fill-opacity", "1")
                    .attr("y", function(d) { return d3.time.weekOfYear(d) * cellSize })
                    .attr("x", function(d) { return d.getDay() * cellSize })
                    .attr("pointer-events", "all")
                    .attr("transform", function(e, j) {
                            return "translate(" + (e.getDay() * 5) + ", " + (d3.time.weekOfYear(e) * 5) + ")";
                    })
                ;
                
                text = container.append("text")
                    .attr("pointer-events", "none")
                    .attr("y", function(d) { return d3.time.weekOfYear(d) * cellSize })
                    .attr("x", function(d) { return d.getDay() * cellSize })
                    .attr("dy", "30")
                    .attr("dx", "15")
                    .attr("font-size", "20")
                    .attr("transform", function(e, j) {
                            return "translate(" + (e.getDay() * 5) + ", " + (d3.time.weekOfYear(e) * 5) + ")";
                    })
                    .text(function(d) { return moment(d).format("D") })
                ;
            });
        }
    
        my.cellSize = function(value) {
            if (!arguments.length) return cellSize;
            cellSize = value;
            return my;
        };
        
        my.rect = function() {
            console.log(rect);
            return rect;
            // cellSize = value;
            // return my;
        };
        
    return my;
}