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
        
//         var bbox = new THREE.BoundingBoxHelper( this.text, 0x0000ff);
//         bbox.update();
// 		this.add(bbox);

        
        Globals.HOURS.INSTANCES[this.hour] = this;
    }
}

export class Day extends THREE.Mesh implements BasicInterface {
    margin: number = 0.1;
    padding: number = 0.5;
    cellSize: number = 30;
    // material: THREE.MeshBasicMaterial = Globals.rectMaterial;
    geometry: THREE.BoxGeometry = Globals.rectGeom;
    box: THREE.Box3 = new THREE.Box3().setFromObject(this);
    date: Moment;
    
    hoverable: boolean = false;
    selectable: boolean = true;
    
    minutesInDay: number = 1440; // (24 hours * 60 minutes)

    dateTitle: THREE.Object3D;
    eventArea: THREE.Mesh;
    hourPadding: number;

    hoveringHighlight: THREE.Mesh;

    uniforms: any = {  
			transform: { type: "f", value: 0 },
		};

	shaderMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({  
            uniforms: this.uniforms,
			vertexShader: document.getElementById('vertexShader').textContent
		});

    constructor(date: Moment) {
        super(Globals.rectGeom, Globals.rectMaterial);
        
        // super(Globals.rectGeom);
        // this.material = this.shaderMaterial;
        
        this.name = "day";
        this.date = date;
        
        
        var start: any = this.date.clone();
        start.add(7, 'hours');
        var end: any = this.date.clone();
        end.add(17, 'hours');
        
        // this.addEvent(
        //     start, 
        //     end
        // );
        
//         var uniforms: any = {  
// 			myColor: { type: "c", value: new THREE.Color( 0xffffff ) },
// 		};
// 		var attributes: any = {  
// 			size: { type: 'f', value: [] },
// 		};
// 		this.shaderMaterial = new THREE.ShaderMaterial({  
// 			uniforms: uniforms,
// 			// attributes: attributes,
// 			vertexShader: document.getElementById('vertexShader').textContent
// 		});
		
		this.draw();
    }

    addEvent(start: Moment, end: Moment) {
        var startOfDay: Moment = start.clone().startOf('day');
        var minutesElapsed = moment.duration(start.diff(startOfDay)).asMinutes();
        var minutesDuration = moment.duration(end.diff(start)).asMinutes();
        
        var eventAreaBox = new THREE.Box3().setFromObject(this.eventArea);
        var minuteToPixelRatio = eventAreaBox.size().y / this.minutesInDay;
        var height = minutesDuration * minuteToPixelRatio;
        var yPosition = (eventAreaBox.size().y / 2) -           // Move to top of parent
                        (height / 2) -                         // Move to top of event
                        (minutesElapsed * minuteToPixelRatio);  // Move to correct position

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
        
//         var dateBbox = new THREE.BoundingBoxHelper( this.dateTitle, 0x00ff00);
//         dateBbox.update();
// 		this.add(dateBbox);
		
		
		
        // console.log(dateBB.max.y);
        var dateHeight = dateBB.size().y + this.padding;
        
        this.eventArea = new THREE.Mesh( 
            new THREE.BoxGeometry( this.cellSize, this.cellSize - dateHeight, 0),
            Globals.rectMaterial
        );
        this.eventArea.name = "eventArea";
        this.eventArea.position.y =  -dateHeight/2;
        this.add(this.eventArea);
     
        var eventAreaBox = new THREE.Box3();
        eventAreaBox.setFromObject(this.eventArea);
     
//         var bbox = new THREE.BoundingBoxHelper( this.eventArea, 0xff0000);
//         bbox.update();
// 		this.add(bbox);

        for (var h = 0; h <= 23; h++) {
            var hour: Hour = new Hour(h);
         
            this.hourPadding = (eventAreaBox.size().y -         // Size of area
                                (Globals.fontSize * 24)) / 24;  // Size of all letters / number of padding spots
         
            var hourToPixelRatio = eventAreaBox.size().y / (this.minutesInDay / 60);
         
            var eventGeometry: THREE.BoxGeometry = 
                new THREE.BoxGeometry(eventAreaBox.size().x, hourToPixelRatio, 0);
            var eventMaterial = h % 2 !== 0 ? 
                                new THREE.MeshBasicMaterial({ color: 0xeeeeee }) :
                                new THREE.MeshBasicMaterial({ color: 0xffffff });
    
            var rect: THREE.Mesh = new THREE.Mesh(eventGeometry, eventMaterial);
            rect.position.y = eventAreaBox.size().y / 2 -
                                hourToPixelRatio / 2 -
                                hourToPixelRatio * h;
            rect.position.z = 3;
            this.eventArea.add(rect);
                    
            var hourBB = new THREE.Box3();
            hourBB.setFromObject(hour);
           
            var padding = this.hourPadding + (hourBB.size().y - Globals.fontSize);
            hour.position.x = -eventAreaBox.size().x / 2 + hourBB.size().x / 2;
            hour.position.y = eventAreaBox.size().y / 2 -
                                hourBB.size().y / 2 -
                                h * hourToPixelRatio -
                                (hourToPixelRatio - hourBB.size().y) / 2; 
            this.eventArea.add(hour);
        }
    }
    
    mouseover(uv: THREE.Vector2) {
        if (this.hoveringHighlight)
            this.eventArea.remove(this.hoveringHighlight);
        
        this.uniforms.transform.value = uv.y * 10;
        
        
        var minuteStep = 5;
        
        var minutes = Math.floor((1 - uv.y) * (this.minutesInDay / minuteStep));
        console.log(moment.utc(moment.duration(minutes * minuteStep, "minutes").asMilliseconds()).format("HH:mm"));
        
        var eventAreaBox = new THREE.Box3().setFromObject(this.eventArea);
        var minuteToPixelRatio = eventAreaBox.size().y / (this.minutesInDay / minuteStep);
        
        var eventGeometry: THREE.BoxGeometry = 
            new THREE.BoxGeometry(eventAreaBox.size().x, minuteToPixelRatio, 0);
        var eventMaterial = new THREE.MeshBasicMaterial({ color: 0xb3ecff })

        var rect: THREE.Mesh = new THREE.Mesh(eventGeometry, eventMaterial);
        rect.position.x = -eventAreaBox.size().x / 2 + eventAreaBox.size().x / 2;
        rect.position.y = eventAreaBox.size().y / 2 -               // Move to top of area
                            eventAreaBox.size().y * (1 - uv.y);     // Move to position based on coordinate
        rect.position.z = 5;
        
        this.hoveringHighlight = rect;
                                   
        this.eventArea.add(this.hoveringHighlight);
    }
}