function day(date) {
        var margin = 0.1;
        
        var x = date.day() * cellSize + date.day() * margin,
            weekOfMonth = date.week(), 
            y = -weekOfMonth * cellSize + -weekOfMonth * margin;
        
        function my() {
            var rectMesh = new THREE.Mesh(rectGeom, rectMaterial);
            rectMesh.position.x = x;
            rectMesh.position.y = y;
            rectMesh.defaultMaterial = rectMaterial
            // rectMesh.onMouseHover = function() {
            //     rectMesh.material = rectMesh.material.clone();
            //     rectMesh.material.color = new THREE.Color( 0xff0000 );
            // }
            
            var day = date.date() - 1,
                month = date.month();

            var dayMesh = new THREE.Mesh(config.DAYS.GEOMETRY[day], textMaterial),
                monthMesh = new THREE.Mesh(config.MONTHS.GEOMETRY[month], textMaterial);
            
            var dayBB = new THREE.Box3();
            dayBB.setFromObject(dayMesh);
            monthMesh.position.x = dayBB.max.x + padding*2;

            var textMesh = new THREE.Object3D();
            textMesh.add(dayMesh);
            textMesh.add(monthMesh);
            
            var bb = new THREE.Box3();
            bb.setFromObject(textMesh);
            textMesh.position.x = -cellSize / 4;
            textMesh.position.y = cellSize / 2 - bb.max.y - padding;
            rectMesh.add(textMesh);
            
            for (var i = 0; i < config.HOURS.NUMBER_OF; i++) {
                var hourBox = new THREE.Mesh(hourBoxGeom, hourMaterial);
                hourBox.position.y = -(cellSize / 2) + (config.HOURS.NUMBER_OF - i) * fontSize * 1.1 + padding;
                hourBox.position.x = fontSize / 2;
                hourBox.position.z = 5;
                hourBox.defaultMaterial = hourMaterial;
                
                // hourBox.onMouseHover = function() {
                //     console.log(hourBox.position);
                //     hourBox.material = hourBox.material.clone();
                //     hourBox.material.color = new THREE.Color(0x0000ff);
                // }
                rectMesh.add(hourBox);
                
                var hour = new THREE.Mesh(config.HOURS.GEOMETRY[i], textMaterial);
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