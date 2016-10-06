import * as moment from 'moment';
type Moment = moment.Moment;

import {Mesh, 
        Object3D, 
        BoxGeometry, 
        MeshBasicMaterial, 
        Geometry, 
        Box3,
        ShaderMaterial,
        Texture,
        OrthographicCamera,
        Vector2
} from 'three';

import * as Globals from './globals';

interface BasicInterface {
    hoverable: boolean;
    // selectable: boolean;
}

class HourMesh extends Mesh implements BasicInterface {
    defaultGeometry: Geometry;
    defaultMaterial: MeshBasicMaterial;
    
    hoverable: boolean = true;
    selectable: boolean = true;
    
    constructor(geometry: Geometry, material: MeshBasicMaterial) {
        super(geometry, material);
        this.defaultGeometry = geometry;
        this.defaultMaterial = material;
    }
}

export class Hour extends Object3D implements BasicInterface {
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
        
        var textBB = new Box3();
        textBB.setFromObject(this.text);
        this.add(this.text);
        
//         var bbox = new BoundingBoxHelper( this.text, 0x0000ff);
//         bbox.update();
// 		this.add(bbox);

        
        Globals.HOURS.INSTANCES[this.hour] = this;
    }
}

export class DailyHours extends Mesh {
    
    minutesInDay: number = 1440; // (24 hours * 60 minutes)
    
    constructor() {
        super();
        
        for (var h = 0; h <= 23; h++) {
            var hour: Hour = new Hour(h);
         
            var hourPadding = (Globals.fontSize * 24) / 24;  // Size of all letters / number of padding spots
         
            var hourToPixelRatio = window.innerHeight / (this.minutesInDay / 60);
            
            var eventGeometry: BoxGeometry = 
                new BoxGeometry(window.innerWidth, hourToPixelRatio, 0);
            var eventMaterial = h % 2 !== 0 ? 
                                new MeshBasicMaterial({ color: 0xeeeeee }) :
                                new MeshBasicMaterial({ color: 0xffffff });
    
            var rect: Mesh = new Mesh(eventGeometry, eventMaterial);
            rect.position.y = window.innerHeight / 2 - 
                                hourToPixelRatio / 2 -
                                hourToPixelRatio * h;
            rect.position.z = 3;
            this.add(rect);
                    
            var hourBB = new Box3();
            hourBB.setFromObject(hour);
           
            var padding = hourPadding + (hourBB.getSize().y - Globals.fontSize);
            hour.position.x = -window.innerWidth / 2 + hourBB.getSize().x / 2;
            
            hour.position.y = window.innerHeight / 2 - 
                                hourBB.getSize().y / 2 -
                                h * hourToPixelRatio -
                                (hourToPixelRatio - hourBB.getSize().y) / 2;

            hour.position.z = 15;
            this.add(hour);
            
        }
    }
}

export class Day extends Mesh implements BasicInterface {
    margin: number = 0.1;
    padding: number = 0.5;
    cellSize: number = 30;
    // material: MeshBasicMaterial = Globals.rectMaterial;
    geometry: BoxGeometry = Globals.rectGeom;
    box: Box3 = new Box3().setFromObject(this);
    date: Moment;
    
    hoverable: boolean = false;
    selectable: boolean = true;
    
    minutesInDay: number = 1440; // (24 hours * 60 minutes)

    dateTitle: Object3D;
    eventArea: Mesh;
    hourPadding: number;

    hoveringHighlight: Mesh;

    uniforms: any = {  
			transform: { type: "f", value: 0 },
		};

	shaderMaterial: ShaderMaterial = new ShaderMaterial({  
            uniforms: this.uniforms,
			vertexShader: document.getElementById('vertexShader').textContent
		});
		
    camera: any;
// 	bufferRenderer: any;
    // bufferScene: any;
	texture:  any;

    constructor(date: Moment, texture: Texture) {
        super(Globals.rectGeom, Globals.rectMaterial);
        // super(Globals.rectGeom);
        
        // this.material = this.shaderMaterial;
        
        this.name = "day";
        this.date = date;
        
        
        
//         var uniforms: any = {  
// 			myColor: { type: "c", value: new Color( 0xffffff ) },
// 		};
// 		var attributes: any = {  
// 			size: { type: 'f', value: [] },
// 		};
// 		this.shaderMaterial = new ShaderMaterial({  
// 			uniforms: uniforms,
// 			// attributes: attributes,
// 			vertexShader: document.getElementById('vertexShader').textContent
// 		});
        
        // this.camera = new PerspectiveCamera( 
        //     30, window.innerWidth / window.innerHeight, 0.1, 50
        // );
        
        this.camera = new OrthographicCamera( 
            window.innerWidth / -2, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            window.innerHeight / -2, 
            -100, 100 );

        this.camera.position.z = 50;

        
        this.texture = texture;
		
		this.draw();
		
// 		var start: any = this.date.clone();
//         start.add(8, 'hours');
//         start.add(17, 'minutes');
//         var end: any = this.date.clone();
//         end.add(12, 'hours');
//         end.add(47, 'minutes');
        
//         this.addEvent(start, end);
		
		
// 		console.log(this);
    }

    // addEvent(start: Moment, end: Moment) {
    //     var startOfDay: Moment = start.clone().startOf('day');
    //     var minutesElapsed = moment.duration(start.diff(startOfDay)).asMinutes();
    //     var minutesDuration = moment.duration(end.diff(start)).asMinutes();
        
    //     var eventAreaBox = new Box3().setFromObject(this.eventArea);
    //     var minuteToPixelRatio = eventAreaBox.getSize().y / this.minutesInDay;
    //     var height = minutesDuration * minuteToPixelRatio;
    //     var yPosition = (eventAreaBox.getSize().y / 2) -           // Move to top of parent
    //                     (height / 2) -                         // Move to top of event
    //                     (minutesElapsed * minuteToPixelRatio);  // Move to correct position

    //     var eventGeometry: BoxGeometry = 
    //         new BoxGeometry(10, height, 0);

    //     var rect: HourMesh = new HourMesh(eventGeometry, Globals.hourMaterial);
    //     rect.position.y = yPosition;
    //     rect.position.x = 0;
    //     rect.position.z = 5;
    //     this.eventArea.add(rect);
    // }

    draw() {
        var weekOfMonth: number = this.date.week();
        var dayOfMonth: number = this.date.day();
        this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
        
        var day = this.date.date() - 1,
            month = this.date.month();
            
        // console.log(Globals.MONTHS.GEOMETRY[month]);

        var dayText = new Mesh(Globals.DAYS.GEOMETRY[day], Globals.textMaterial),
            monthText = new Mesh(Globals.MONTHS.GEOMETRY[month], Globals.textMaterial);
        
        this.dateTitle = new Object3D();
        this.dateTitle.add(dayText);
        this.dateTitle.add(monthText);

        dayText.geometry.center();
        monthText.geometry.center();
        
        var dayBB = new Box3();
        dayBB.setFromObject(dayText);
        dayText.position.x = -dayBB.max.x - this.padding/2; 

        var monthBB = new Box3();
        monthBB.setFromObject(monthText);
        monthText.position.x = monthBB.max.x + this.padding / 2;

        var dateBB = new Box3();
        dateBB.setFromObject(this.dateTitle);
        this.dateTitle.position.y = this.cellSize / 2 - dateBB.max.y - this.padding;
        this.add(this.dateTitle);

        var dateHeight = dateBB.getSize().y + this.padding;
        
        this.eventArea = new Mesh( 
            new BoxGeometry( this.cellSize, this.cellSize - dateHeight, 0)
        );
        this.eventArea.name = "eventArea";
        this.eventArea.position.y =  -dateHeight/2;
        this.add(this.eventArea);
     
        var eventAreaBox = new Box3();
        eventAreaBox.setFromObject(this.eventArea);
     
        this.eventArea.material = new MeshBasicMaterial( { map: this.texture } );
    }
    
    mouseover(uv: Vector2) {
        if (this.hoveringHighlight)
            this.eventArea.remove(this.hoveringHighlight);
        
        this.uniforms.transform.value = uv.y * 10;
        
        var minuteStep = 5;
        
        var minutes = Math.floor((1 - uv.y) * (this.minutesInDay / minuteStep));
        // console.log(moment.utc(moment.duration(minutes * minuteStep, "minutes").asMilliseconds()).format("HH:mm"));
        
        var eventAreaBox = new Box3().setFromObject(this.eventArea);
        var minuteToPixelRatio = eventAreaBox.getSize().y / (this.minutesInDay / minuteStep);
        
        var eventGeometry: BoxGeometry = 
            new BoxGeometry(eventAreaBox.getSize().x, minuteToPixelRatio, 0);
        var eventMaterial = new MeshBasicMaterial({ color: 0xb3ecff })

        var rect: Mesh = new Mesh(eventGeometry, eventMaterial);
        rect.position.x = -eventAreaBox.getSize().x / 2 + eventAreaBox.getSize().x / 2;
        rect.position.y = eventAreaBox.getSize().y / 2 -               // Move to top of area
                            eventAreaBox.getSize().y * (1 - uv.y);     // Move to position based on coordinate
        rect.position.z = 5;
        
        this.hoveringHighlight = rect;
                                   
        this.eventArea.add(this.hoveringHighlight);
    }
}