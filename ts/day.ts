///<reference path="../typings/index.d.ts"/>
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
    date: Moment;
    selected: boolean = false;
    
    rect: HourMesh;
    text: HourMesh;
    
    hoverable: boolean = true;
    
    constructor(date: Moment) {
        super();
        this.date = date.clone();
        this.name = "hour";
        
        this.draw();
    } 
    
    draw() {
        var currentHour: number = this.date.hour();
        
        this.rect = new HourMesh(hourBoxGeom, hourMaterial);
        // this.rect.geometry.center();
        this.rect.position.y = -(cellSize / 2) + (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding;
        this.rect.position.x = fontSize / 2;
        this.rect.position.z = 5;
        this.add(this.rect);
        
        this.text = new HourMesh(Config.HOURS.GEOMETRY[currentHour], textMaterial);
        this.text.geometry.center();
        
        var textBB = new THREE.Box3();
        textBB.setFromObject(this.text);
        // this.text.position.x = textBB.max.x; 

        this.text.position.x = -cellSize / 2 + textBB.max.x;
        this.text.position.y = -cellSize / 2 + (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding - fontSize / 2 + textBB.max.y;
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
    
    // onMouseClick() {
    select(selection: boolean) {
            this.selected = selection;
            
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
            this.rect.material.color = new THREE.Color(0xaaaaaa);
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
    padding: number = 0.5;
    cellSize: number = 30;
    material: THREE.MeshBasicMaterial = rectMaterial;
    geometry: THREE.BoxGeometry = rectGeom;
    date: Moment;
    
    hoverable: boolean = false;
    selectable: boolean = true;
    
    constructor(date: Moment) {
        super(rectGeom, rectMaterial);
        this.date = date;
        this.draw();
    }

    draw() {
        this.name = "day";
        
        var weekOfMonth: number = this.date.week();
        var dayOfMonth: number = this.date.day();
        this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
        
        var day = this.date.date() - 1,
            month = this.date.month();

        var dayText = new THREE.Mesh(Config.DAYS.GEOMETRY[day], textMaterial),
            monthText = new THREE.Mesh(Config.MONTHS.GEOMETRY[month], textMaterial);
        
        var dateText = new THREE.Object3D()
        dateText.add(dayText);
        dateText.add(monthText);

        dayText.geometry.center();
        monthText.geometry.center();
        
        var dayBB = new THREE.Box3();
        dayBB.setFromObject(dayText);
        dayText.position.x = -dayBB.max.x - this.padding/2; 

        var monthBB = new THREE.Box3();
        monthBB.setFromObject(monthText);
        monthText.position.x = monthBB.max.x + this.padding / 2;

        var dateBB = new THREE.Box3();
        dateBB.setFromObject(dateText);
        dateText.position.y = cellSize / 2 - dateBB.max.y - this.padding;
        this.add(dateText);

        for (var i = this.date.clone().startOf("day"); i.isBefore(this.date.clone().endOf("day")); i.add(1, "hours")) {
            this.add(new Hour(i));
        }
    }
}