///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
///<reference path="../typings/main/ambient/moment/moment.d.ts"/>
///<reference path="config.ts"/>

interface BasicInterface {
    hoverable: boolean;
    // selectable: boolean;
}

class HourMesh extends THREE.Mesh implements BasicInterface {
    defaultGeometry: THREE.Geometry;
    defaultMaterial: THREE.MeshBasicMaterial;
    
    hoverable: boolean = true;
    selectable: boolean = true;
    
    constructor(geometry: THREE.Geometry, material: THREE.MeshBasicMaterial) {
        super(geometry, material);
        this.defaultGeometry = geometry;
        this.defaultMaterial = material;
    }
}

class Hour extends THREE.Object3D implements BasicInterface {
    date: moment.Moment;
    selected: boolean = false;
    
    rect: HourMesh;
    text: HourMesh;
    
    hoverable: boolean = true;
    
    constructor(date: moment.Moment) {
        super();
        this.date = date.clone();
        this.name = "hour";
        
        this.draw();
    }
    
    draw() {
        var currentHour: number = this.date.hour();
        
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
        
        Config.HOURS.INSTANCES[+this.date] = this;
    }
    
    onMouseClick() {
            this.selected = !this.selected;
            
            console.log("Hour clicked:");
            console.log(this.date.format("DD MMM HH:mm"));
            console.log(this.selected);
            
            if (this.selected) {
                this.rect.material = this.rect.defaultMaterial.clone();
                this.rect.material.color = new THREE.Color(0x0000ff);
            } else {
                this.rect.material = this.rect.defaultMaterial;
            }
        
        
    
        // console.log(this.date.format("DD MMM HH:mm"));    
    }
    
    onMouseHover() {
        if (!this.selected && this.rect.material === this.rect.defaultMaterial) {
            this.rect.material = this.rect.defaultMaterial.clone();
            this.rect.material.color = new THREE.Color(0x00ff00);
        }
        // console.log(this.date.format("DD MMM HH:mm"));
        // console.log(this.date);
        
    }
        
    onMouseOut() {
        if (!this.selected) {
            this.rect.material = this.rect.defaultMaterial;
        }
    }
}

class Day extends THREE.Mesh implements BasicInterface {
    margin: number = 0.1;
    cellSize: number = 30;
    material: THREE.MeshBasicMaterial = rectMaterial;
    geometry: THREE.BoxGeometry = rectGeom;
    date: moment.Moment;
    
    hoverable: boolean = false;
    selectable: boolean = true;
    
    constructor(date: moment.Moment) {
        super(rectGeom, rectMaterial);
        this.date = date;
        // console.log(this.date);
        this.draw();
    }

    draw() {
        this.name = "day";
        
        var weekOfMonth: number = this.date.week();
        var dayOfMonth: number = this.date.day();
        this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
        
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
        
        for (var i = this.date.clone().startOf("day"); i.isBefore(this.date.clone().endOf("day")); i.add(1, "hours")) {
            this.add(new Hour(i));
        }
    }
}