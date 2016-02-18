function day(date) {
        var margin = 0.1;
        
        var x = date.day() * cellSize + date.day() * margin,
            weekOfMonth = date.week(), 
            y = -weekOfMonth * cellSize + -weekOfMonth * margin;
        
        function my() {
            var rectMesh = new THREE.Mesh(rectGeom, rectMaterial);
            rectMesh.position.x = x;
            rectMesh.position.y = y;
            
            var dateSize = cellSize / 8;
            var textGeo = new THREE.TextGeometry(date.format("DD MMM"), {
                font: font,
                size: dateSize,
                dynamic: false
            });
            
            var textMesh = new THREE.Mesh(textGeo, textMaterial);
            var bb = new THREE.Box3();
            bb.setFromObject(textMesh);
            
            var padding = 0.5;
            textMesh.position.x = -cellSize / 4;
            textMesh.position.y = cellSize / 2 - bb.max.y - padding;
            // textGeo.computeBoundingBox();
            // textGeo.computeVertexNormals();
            rectMesh.add(textMesh);
            
            var hoursArea = cellSize - padding*2 - bb.max.y*2;
            var fontSize = hoursArea / 24;
            for (var i = 0; i <= 24; i++) {
                var hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);
                var hourBox = new THREE.Mesh(hourBoxGeom, hourMaterial);
                hourBox.position.y = -cellSize / 2 +  (24 - i) * fontSize * 1.1 + padding;
                hourBox.position.x = fontSize/2;
                rectMesh.add(hourBox);
                
                var hourGeo = new THREE.TextGeometry(i, {
                    font: font,
                    size: fontSize,
                    dynamic: false
                });
                
                var hour = new THREE.Mesh(hourGeo, textMaterial);
                hour.position.x = -cellSize / 2;
                hour.position.y = -cellSize / 2 +  (24 - i) * fontSize * 1.1 + padding - fontSize / 2;
                rectMesh.add(hour);
            }

            return rectMesh;
        }
    
        my.cellSize = function(value) {
            if (!arguments.length) return cellSize;
            cellSize = value;
            return my;
        };
        
        my.margin = function(value) {
            if (!arguments.length) return margin;
            margin = value;
            return my;
        };
        
        my.create = function() {
            return my();
        }
        
    return my;
}