function day(d, cellSize) {
        var svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'));
        var group = svg.append("g");
    
        var selectionRange = {start: null, end: null};
        
        group
            .attr("class", "day")
            .append("rect")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("fill", "none")
                .attr("fill-opacity", "1")
                .attr("x", d3.time.weekOfYear(d) * cellSize)
                .attr("y", d.getDay() * cellSize)
                .attr("pointer-events", "all")
                .on('mousedown', function(d){
                    if (d3.event.shiftKey) {
                        selectionRange.start = d;   
                    }
                })
                .on('mouseup', function(d){
                    if (d3.event.shiftKey) {
                        selectionRange.end = d;
                        console.log(moment.duration(selectionRange.end - selectionRange.start).asDays());
                        
                        selectionRange.start = null;
                        selectionRange.end = null;
                    }
                })
                .on('mouseover', function(d) {
                    d3.select(this).style("fill-opacity", "0.7")
        
                    if (selectionRange.start && d3.event.shiftKey) {
                        years.selectAll(".day")
                            .each(function(e) {
                                if (selectionRange.start <= e && e <= d) {
                                    d3.select(this).style("fill", "lightblue")
                                } else {
                                    d3.select(this).style("fill", "white")
                                    d3.select(this).style("fill-opacity", "1")
                                }
                            })
                        ;
                    }
                })
                .on('mouseout', function(d){
                    d3.select(this).style("fill-opacity", "1")
                })
                .on('click', function(d, i) {
                    d3.select(this).style("fill", "lightblue");
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
                        
                        scale = 25;
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
        
        group
            .append("text")
                .attr("pointer-events", "none")
                .attr("x", d3.time.weekOfYear(d) * cellSize)
                .attr("y", d.getDay() * cellSize)
                .attr("dy", "12")
                .attr("dx", "3")
                .text(moment(d).format("D"))
        ;

    return group.node();
}