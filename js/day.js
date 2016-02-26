function hour(date) {
    var newHour = new THREE.Object3D();
    newHour.date = date;
    newHour.selected = false;
    newHour.name = "hour";
    
    var currentHour = date.format("H");    
    newHour.rect = new THREE.Mesh(hourBoxGeom, hourMaterial);
    newHour.rect.position.y = -(cellSize / 2) + (config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding;
    newHour.rect.position.x = fontSize / 2;
    newHour.rect.position.z = 5;

    newHour.rect.defaultMaterial = hourMaterial;
    newHour.rect.onMouseHover = function() { newHour.onMouseHover(); }
    newHour.rect.onMouseOut = function() { newHour.onMouseOut(); }
    newHour.rect.onMouseClick = function() { newHour.onMouseClick(); }
    newHour.add(newHour.rect);
    
    newHour.text = new THREE.Mesh(config.HOURS.GEOMETRY[currentHour], textMaterial);
    newHour.text.position.x = -cellSize / 2;
    newHour.text.position.y = -cellSize / 2 +  (config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding - fontSize / 2;

    newHour.text.defaultMaterial = textMaterial;
    newHour.text.onMouseHover = function() { newHour.onMouseHover(); }
    newHour.text.onMouseOut = function() { newHour.onMouseOut(); }
    newHour.text.onMouseClick = function() { newHour.onMouseClick(); }
    newHour.add(newHour.text);
    
    newHour.onMouseHover = function() {
        if (!newHour.selected) {
            newHour.rect.material = newHour.rect.material.clone();
            newHour.rect.material.color = new THREE.Color(0x00ff00);
        }
    }
    
    newHour.onMouseOut = function() {
        // newHour.rect.material = newHour.rect.defaultMaterial;
    }
    
    newHour.onMouseClick = function() {
        newHour.selected = !newHour.selected;
        
        console.log("Hour clicked:");
        console.log(newHour.date);
        console.log("############################");
        
        if (newHour.selected) {
            newHour.rect.material = newHour.rect.material.clone();
            newHour.rect.material.color = new THREE.Color(0x0000ff);
        } else {
            newHour.rect.material = newHour.rect.defaultMaterial;
        }
    }
    
    config.HOURS.INSTANCES[date] = newHour;
    return newHour;
}

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
            rectMesh.name = "day";
            rectMesh.onMouseHover = function() {
                // rectMesh.material = rectMesh.material.clone();
                // rectMesh.material.color = new THREE.Color( 0xff0000 );
            }
            
            rectMesh.onMouseOut = function() {
                // rectMesh.material = rectMesh.defaultMaterial;
            }
            
            rectMesh.onMouseClick = function() { }
            
            var day = date.date() - 1,
                month = date.month();

            var dayMesh = new THREE.Mesh(config.DAYS.GEOMETRY[day], textMaterial),
                monthMesh = new THREE.Mesh(config.MONTHS.GEOMETRY[month], textMaterial);
            
            dayMesh.defaultMaterial = textMaterial;
            monthMesh.defaultMaterial = textMaterial;
            
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
            
            for (var i = date.clone().startOf("day"); +i < +date.clone().endOf("day"); i.add(1, "hours")) {
                // console.log("Creating hour:");
                // console.log(i.toDate());
                // console.log(i.format("HH:mm") + " = " + date.clone().endOf("day").format("HH:mm"));
                // startDate.add(1, "hours");
                
                // startDate;
                // console.log(startDate);
                // console.log(startDate.isBefore(date.endOf("day")));
                
                rectMesh.add(hour(i));
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