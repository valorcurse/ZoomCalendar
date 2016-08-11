import * as moment from 'moment';
type Moment = moment.Moment;

import * as THREE from 'three';

import * as Globals from './globals.ts';

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

export class Hour extends THREE.Object3D implements BasicInterface {
    hour: number;
    selected: boolean = false;
    
    // rect: HourMesh;
    text: HourMesh;
    
    hoverable: boolean = true;
    
    constructor(hour: number) {
        super();
        this.hour = hour;
        this.name = "hour";
        
        this.draw();
    } 
    
    draw() {
        this.text = new HourMesh(Globals.HOURS.GEOMETRY[this.hour], Globals.textMaterial);
        this.text.geometry.center();
        
        var textBB = new THREE.Box3();
        textBB.setFromObject(this.text);
        this.add(this.text);
        
        var bbox = new THREE.BoundingBoxHelper( this.text, 0x0000ff);
        bbox.update();
		this.add(bbox);

        
        Globals.HOURS.INSTANCES[this.hour] = this;
    }
    
    // onMouseClick() {
    // select(selection: boolean) {
    //         this.selected = selection;
            
    //         console.log("Hour clicked:");
    //         console.log(this.date.format("DD MMM HH:mm"));
    //         console.log(this.selected);
            
    //         if (this.selected) {
    //             this.rect.material = this.rect.defaultMaterial.clone();
    //             this.rect.material.color = new THREE.Color(0x0000ff);
    //         } else {
    //             this.rect.material = this.rect.defaultMaterial;
    //         }
        
        
    
    //     // console.log(this.date.format("DD MMM HH:mm"));    
    // }
    
    // onMouseHover() {
    //     if (!this.selected && this.rect.material === this.rect.defaultMaterial) {
    //         this.rect.material = this.rect.defaultMaterial.clone();
    //         this.rect.material.color = new THREE.Color(0xaaaaaa);
    //     }
    //     // console.log(this.date.format("DD MMM HH:mm"));
    //     // console.log(this.date);
        
    // }
        
    // onMouseOut() {
    //     if (!this.selected) {
    //         this.rect.material = this.rect.defaultMaterial;
    //     }
    // }
}

export class Day extends THREE.Mesh implements BasicInterface {
    margin: number = 0.1;
    padding: number = 0.5;
    cellSize: number = 30;
    material: THREE.MeshBasicMaterial = Globals.rectMaterial;
    geometry: THREE.BoxGeometry = Globals.rectGeom;
    box: THREE.Box3 = new THREE.Box3().setFromObject(this);
    date: Moment;
    
    hoverable: boolean = false;
    selectable: boolean = true;
    
    minutesInDay: number = 1440; // (24 * 60)

    dateTitle: THREE.Object3D;
    eventArea: THREE.Mesh;

    constructor(date: Moment) {
        super(Globals.rectGeom, Globals.rectMaterial);
        this.name = "day";
        this.date = date;
        this.draw();
        
        var start: any = this.date.clone();
        start.add(7, 'hours');
        var end: any = this.date.clone();
        end.add(17, 'hours');
        
        this.addEvent(
            start, 
            end
        );
    }

    addEvent(start: Moment, end: Moment) {
        var startOfDay: Moment = start.clone().startOf('day');
        // console.log(start.startOf('day').toDate());
        var minutesElapsed = moment.duration(start.diff(startOfDay)).asMinutes();
        var minutesDuration = moment.duration(end.diff(start)).asMinutes();
        // console.log("minutes: " + minutesElapsed);
        
        var box = new THREE.Box3().setFromObject(this.dateTitle);
        // console.log(box.size());
        var height = minutesDuration / this.minutesInDay * (this.cellSize - box.size().y);
        var yPosition = height/2 - minutesElapsed / this.minutesInDay * this.cellSize;

        
        // console.log(yPosition + ": " + this.box.size().y);

        var eventGeometry: THREE.BoxGeometry = 
            new THREE.BoxGeometry(10, height, 0);

        var rect: HourMesh = new HourMesh(eventGeometry, Globals.hourMaterial);
        rect.position.y = yPosition;
        rect.position.x = 0;
        rect.position.z = 5;
        this.eventArea.add(rect);
    }

    draw() {
        var weekOfMonth: number = this.date.week();
        var dayOfMonth: number = this.date.day();
        this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
        
        var day = this.date.date() - 1,
            month = this.date.month();

        var dayText = new THREE.Mesh(Globals.DAYS.GEOMETRY[day], Globals.textMaterial),
            monthText = new THREE.Mesh(Globals.MONTHS.GEOMETRY[month], Globals.textMaterial);
        
        this.dateTitle = new THREE.Object3D()
        // console.log(this.dateTitle.position);
        this.dateTitle.add(dayText);
        this.dateTitle.add(monthText);

        dayText.geometry.center();
        monthText.geometry.center();
        
        var dayBB = new THREE.Box3();
        dayBB.setFromObject(dayText);
        dayText.position.x = -dayBB.max.x - this.padding/2; 

        var monthBB = new THREE.Box3();
        monthBB.setFromObject(monthText);
        monthText.position.x = monthBB.max.x + this.padding / 2;

        var dateBB = new THREE.Box3();
        dateBB.setFromObject(this.dateTitle);
        this.dateTitle.position.y = this.cellSize / 2 - dateBB.max.y - this.padding;
        this.add(this.dateTitle);
        
        var dateBbox = new THREE.BoundingBoxHelper( this.dateTitle, 0x00ff00);
        dateBbox.update();
		this.add(dateBbox);
		
		
		
        // console.log(dateBB.max.y);
        var dateHeight = dateBB.size().y + this.padding;
        
        this.eventArea = new THREE.Mesh( 
            new THREE.BoxGeometry( this.cellSize, this.cellSize - dateHeight, 0)
        );
        this.eventArea.position.y =  -dateHeight/2;
        this.add(this.eventArea);
     
        var eventAreaBox = new THREE.Box3();
        eventAreaBox.setFromObject(this.eventArea);
     
//         var bbox = new THREE.BoundingBoxHelper( this.eventArea, 0xff0000);
//         bbox.update();
// 		this.add(bbox);

        for (var h = 0; h <= 23; h++) {
            var hour: Hour = new Hour(h);
                    
            var hourBB = new THREE.Box3();
            hourBB.setFromObject(hour);
            var padding = (eventAreaBox.size().y - (Globals.fontSize * 24)) / 23;
            hour.position.x = -eventAreaBox.size().x / 2 + hourBB.size().x / 2;
            hour.position.y = eventAreaBox.size().y / 2 - 
                                hourBB.size().y / 2 -
                                h * Globals.fontSize -
                                h * padding;
            this.eventArea.add(hour);
        }
    }
}