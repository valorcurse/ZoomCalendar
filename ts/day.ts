///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
///<reference path="../typings/main/ambient/moment/moment.d.ts"/>
///<reference path="config.ts"/>

 class HourMesh extends THREE.Mesh {
    defaultGeometry: THREE.Geometry;
    defaultMaterial: THREE.Material;
        
    constructor(geometry: THREE.Geometry, material: THREE.Material) {
        super(geometry, material);
        this.defaultGeometry = geometry;
        this.defaultMaterial = material;
    }
}

class Hour extends THREE.Object3D {
    date: moment.Moment;
    selected: boolean = false;
    
    rect: THREE.Mesh;
    text: THREE.Mesh;
    
    constructor(date: moment.Moment) {
        super();
        
        this.date = date;
        this.name = "hour";
        
        this.draw();
    }
    
    draw() {
        var currentHour: number = +this.date.format("H");
        
        this.rect = new HourMesh(hourBoxGeom, hourMaterial);
        this.rect.position.y = -(cellSize / 2) + (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding;
        this.rect.position.x = fontSize / 2;
        this.rect.position.z = 5;
    
        // this.rect.onMouseHover = function() { this.onMouseHover(); }
        // this.rect.onMouseOut = function() { this.onMouseOut(); }
        // this.rect.onMouseClick = function() { this.onMouseClick(); }
        this.add(this.rect);
        
        this.text = new HourMesh(Config.HOURS.GEOMETRY[currentHour], textMaterial);
        this.text.position.x = -cellSize / 2;
        this.text.position.y = -cellSize / 2 +  (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding - fontSize / 2;
    
        // this.text.onMouseHover = function() { this.onMouseHover(); }
        // this.text.onMouseOut = function() { this.onMouseOut(); }
        // this.text.onMouseClick = function() { this.onMouseClick(); }
        this.add(this.text);
        
        // this.onMouseHover = function() {
        //     if (!this.selected) {
        //         rect.material = rect.material.clone();
        //         rect.material.color = new THREE.Color(0x00ff00);
        //     }
        // }
        
        // this.onMouseOut = function() {
        //     // this.rect.material = this.rect.defaultMaterial;
        // }
        
        // this.onMouseClick = function() {
        //     this.selected = !this.selected;
            
        //     console.log("Hour clicked:");
        //     console.log(this.date);
        //     console.log("############################");
            
        //     if (this.selected) {
        //         rect.material = rect.material.clone();
        //         this.rect.material.color = new THREE.Color(0x0000ff);
        //     } else {
        //         this.rect.material = rect.defaultMaterial;
        //     }
        // }
        
        // Config.HOURS.INSTANCES[this.date] = this;
    }
}

class Day extends THREE.Mesh {
        margin: number = 0.1;
        cellSize: number = 30;
        material: THREE.MeshBasicMaterial = rectMaterial;
        geometry: THREE.BoxGeometry = rectGeom;
        date: moment.Moment;
        
        constructor(date: moment.Moment) {
            super(rectGeom, rectMaterial);
            this.date = date;
            this.draw();
        }

        draw() {
            // var rectMesh = new THREE.Mesh(rectGeom, rectMaterial);
            // this.position.x = x;
            // this.position.y = y;
            this.name = "day";
            
            var weekOfMonth: number = this.date.week();
            var dayOfMonth: number = this.date.day();
            this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
            this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
            
            // this.name = "day";
            // this.onMouseHover = function() {
                // rectMesh.material = rectMesh.material.clone();
                // rectMesh.material.color = new THREE.Color( 0xff0000 );
            // }
            
            // this.onMouseOut = function() {
                // rectMesh.material = rectMesh.defaultMaterial;
            // }
            
            // this.onMouseClick = function() { }
            
            var day = this.date.date() - 1,
                month = this.date.month();

            var dayMesh = new THREE.Mesh(Config.DAYS.GEOMETRY[day], textMaterial),
                monthMesh = new THREE.Mesh(Config.MONTHS.GEOMETRY[month], textMaterial);
            
            // dayMesh.defaultMaterial = textMaterial;
            // monthMesh.defaultMaterial = textMaterial;
            
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
            this.add(textMesh);
            
            for (var i = this.date.startOf("day"); i < this.date.endOf("day"); i.add(1, "hours")) {
                // console.log("Creating hour:");
                // console.log(i.toDate());
                // console.log(i.format("HH:mm") + " = " + date.clone().endOf("day").format("HH:mm"));
                // startDate.add(1, "hours");
                
                // startDate;
                // console.log(startDate);
                // console.log(startDate.isBefore(date.endOf("day")));
                
                this.add(new Hour(i));
            }
        }
    
    //     my.cellSize = function(value) {
    //         if (!arguments.length) return cellSize;
    //         cellSize = value;
    //         return my;
    //     };
        
    //     my.margin = function(value) {
    //         if (!arguments.length) return margin;
    //         margin = value;
    //         return my;
    //     };
        
    //     my.create = function() {
    //         return my();
    //     }
        
    // return my;
}