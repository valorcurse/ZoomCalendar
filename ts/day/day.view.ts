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

import {Event} from "./event/event.model";
import {DayModel} from "./day.model";

import {
    RTT, 
    BasicInterface,
    MONTHS,
    DAYS,
    HOURS,
    Materials,
    Components,
    Sizes,
    Constants
} from '../globals';

class HourMesh extends Mesh implements BasicInterface {
    defaultGeometry: Geometry;
    defaultMaterial: MeshBasicMaterial;
    
    intersectable: boolean = false;
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
    
    intersectable: boolean = false;
    
    constructor(hour: number) {
        super();
        this.hour = hour;
        this.name = "hour";
        
        this.draw();
    } 
    
    draw() {
        this.text = new HourMesh(HOURS.GEOMETRY[this.hour], Materials.textMaterial);
        this.text.geometry.center();
        this.add(this.text);
        
        // var textBB = new Box3();
        // textBB.setFromObject(this.text);
//         var bbox = new BoundingBoxHelper( this.text, 0x0000ff);
//         bbox.update();
// 		this.add(bbox);

        
        HOURS.INSTANCES[this.hour] = this;
    }
}

export class DailyHours extends Mesh {
    
    constructor() {
        super();
        
        var hourPadding = (Sizes.fontSize * 24) / 24;  // Size of all letters / number of padding spots
     
        var hourToPixelRatio = window.innerHeight / (Constants.minutesInDay / 60);
        
        var eventGeometry: BoxGeometry = 
            new BoxGeometry(window.innerWidth, hourToPixelRatio, 0);
                                
        for (var h = 0; h <= 23; h++) {
            var hour: Hour = new Hour(h);
         
    
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
           
            var padding = hourPadding + (hourBB.getSize().y - Sizes.fontSize);
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

export class DayView extends Mesh implements BasicInterface {
    day: DayModel;
    
    margin: number = 0.1;
    padding: number = 0.5;
    
    box: Box3 = new Box3().setFromObject(this);
    
    intersectable: boolean = false;
    selectable: boolean = true;

    dateTitle: Object3D;
    eventArea: Mesh;
    hourPadding: number;

    uniforms: any = {  
			transform: { type: "f", value: 0 },
		};

	shaderMaterial: ShaderMaterial = new ShaderMaterial({  
            uniforms: this.uniforms,
			vertexShader: document.getElementById('vertexShader').textContent
		});

    constructor(day: DayModel) {
        super(Components.rectGeom, Materials.rectMaterial);

        this.name = "day";
        this.day = day;
        
		this.draw();
    }

    addEvent(event: Event) {
        var startOfDay: Moment = event.start().clone().startOf('day');
        
        var minutesElapsed = moment.duration(event.start().diff(startOfDay)).asMinutes();
        var minutesDuration = moment.duration(event.end().diff(event.start())).asMinutes();
        
        var eventAreaBox = new Box3().setFromObject(this.eventArea);
        var minuteToPixelRatio = eventAreaBox.getSize().y / Constants.minutesInDay;
        var height = minutesDuration * minuteToPixelRatio;
        var yPosition = (eventAreaBox.getSize().y / 2) -        // Move to top of parent
                        (height / 2) -                          // Move to top of event
                        (minutesElapsed * minuteToPixelRatio);  // Move to correct position

        var eventGeometry: BoxGeometry = 
            new BoxGeometry(10, height, 0);

        var rect: HourMesh = new HourMesh(eventGeometry, Materials.hourMaterial);
        rect.position.y = yPosition;
        rect.position.x = 0;
        rect.position.z = 5;
        this.eventArea.add(rect);
    }

    draw() {
        var weekOfMonth: number = this.day.moment().week();
        var dayOfMonth: number = this.day.moment().day();
        this.position.x = dayOfMonth * Sizes.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * Sizes.cellSize + -weekOfMonth * this.margin;
        
        var day = this.day.moment().date() - 1,
            month = this.day.moment().month();
            
        // console.log(MONTHS.GEOMETRY[month]);

        var dayText = new Mesh(DAYS.GEOMETRY[day], Materials.textMaterial),
            monthText = new Mesh(MONTHS.GEOMETRY[month], Materials.textMaterial);
        
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
        this.dateTitle.position.y = Sizes.cellSize / 2 - dateBB.max.y - this.padding;
        this.add(this.dateTitle);

        var dateHeight = dateBB.getSize().y + this.padding;
        
        var eventArea = new EventArea(
            Sizes.cellSize, 
            Sizes.cellSize - dateHeight
        );
        
        eventArea.position.y = -dateHeight/2;
        
        this.add(eventArea);
    }
}

class EventArea extends Mesh implements BasicInterface {
    intersectable: boolean = true;
    
    hoveringHighlight: Mesh;
    
    dragStart: Vector2;
    
    constructor(width: number, height: number) {
        super(
            new BoxGeometry( width, height, 0), 
            new MeshBasicMaterial( { map: RTT.dayTexture } )
        );
            
        this.name = "eventArea";
    }
    
    mouseDown(uv: Vector2) {
        this.dragStart = uv;
    }
    
    mouseUp(uv: Vector2) {
        this.dragStart = null;
    }
    
    mouseMove(uv: Vector2) {
        if (this.hoveringHighlight)
            this.remove(this.hoveringHighlight);
        
        console.log(this.dragStart);
        
        
        
        var minuteStep = 5;
        
        var minutes = Math.floor((1 - uv.y) * (Constants.minutesInDay / minuteStep));
        
        var eventAreaBox = new Box3().setFromObject(this);
        var minuteToPixelRatio = eventAreaBox.getSize().y / (Constants.minutesInDay / minuteStep);
        
        if (this.dragStart) {
            // eventAreaBox.getSize().y * (1 - uv.y);
            minuteToPixelRatio = Math.abs(uv.y - this.dragStart.y) * eventAreaBox.getSize().y;
        }
        
        var eventGeometry: BoxGeometry = 
            new BoxGeometry(eventAreaBox.getSize().x, minuteToPixelRatio, 0);
        var eventMaterial = new MeshBasicMaterial({ color: 0xb3ecff })

        var rect: Mesh = new Mesh(eventGeometry, eventMaterial);
        rect.position.x = -eventAreaBox.getSize().x / 2 + eventAreaBox.getSize().x / 2;
        rect.position.y = eventAreaBox.getSize().y / 2 -               // Move to top of area
                            eventAreaBox.getSize().y * (1 - uv.y);     // Move to position based on coordinate
                            
        if (this.dragStart) {
            rect.position.y = eventAreaBox.getSize().y / 2 -               // Move to top of area
                            eventAreaBox.getSize().y * (1 - uv.y/2 - this.dragStart.y/2);     // Move to position based on coordinate
        }
                            
        rect.position.z = 5;
        
        this.hoveringHighlight = rect;
                                   
        this.add(this.hoveringHighlight);
    }
}