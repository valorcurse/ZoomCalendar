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

import {View} from "../base/view";
import {EventView} from "./event/event.view";
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
        
        // const textBB = new Box3();
        // textBB.setFromObject(this.text);
//         const bbox = new BoundingBoxHelper( this.text, 0x0000ff);
//         bbox.update();
// 		this.add(bbox);

        
        HOURS.INSTANCES[this.hour] = this;
    }
}

export class DailyHours extends Mesh {
    
    constructor() {
        super();
        
        const hourPadding = (Sizes.fontSize * 24) / 24;  // Size of all letters / number of padding spots
     
        const hourToPixelRatio = window.innerHeight / (Constants.minutesInDay / 60);
        
        const eventGeometry: BoxGeometry = 
            new BoxGeometry(window.innerWidth, hourToPixelRatio, 0);
                                
        for (let h = 0; h <= 23; h++) {
            const hour: Hour = new Hour(h);
         
    
            const eventMaterial = h % 2 !== 0 ? 
                            new MeshBasicMaterial({ color: 0xeeeeee }) :
                            new MeshBasicMaterial({ color: 0xffffff });
                            
            const rect: Mesh = new Mesh(eventGeometry, eventMaterial);
            rect.position.y = window.innerHeight / 2 - 
                                hourToPixelRatio / 2 -
                                hourToPixelRatio * h;
            rect.position.z = 3;
            this.add(rect);
                    
            const hourBB = new Box3();
            hourBB.setFromObject(hour);
           
            const padding = hourPadding + (hourBB.getSize().y - Sizes.fontSize);
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

export class DayView extends View {
    day: DayModel;
    
    margin: number = 0.1;
    padding: number = 0.5;
    
    box: Box3 = new Box3().setFromObject(this);

    dateTitle: Object3D;
    eventArea: Object3D;

    // uniforms: any = {  
// 			transform: { type: "f", value: 0 },
// 		};

// 	shaderMaterial: ShaderMaterial = new ShaderMaterial({  
            // uniforms: this.uniforms,
// 			vertexShader: document.getElementById('vertexShader').textContent
// 		});

    constructor(day: DayModel) {
        super(Components.rectGeom, Materials.rectMaterial);

        this.name = "day";
        this.day = day;
		this.draw();
        
        
        this.day.registerObserver("EventAdded", (event: EventView) => this.addEvent(event));
        this.day.registerObserver("EventRemoved", (event: EventView) => this.removeEvent(event));
    }

    addEvent(event: EventView) {
        console.log(event);
        this.eventArea.add(event);
    }
    
    // createEvent(start: number, end: number) {
    //     this.notifyObservers("CreateEvent", {start: start, end: end});
    // }
    
    removeEvent(event: EventView) {
        this.eventArea.remove(event);
    }

    draw() {
        const weekOfMonth: number = this.day.moment().week();
        const dayOfMonth: number = this.day.moment().day();
        this.position.x = dayOfMonth * Sizes.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * Sizes.cellSize + -weekOfMonth * this.margin;
        
        const day = this.day.moment().date() - 1,
            month = this.day.moment().month();
            
        // console.log(MONTHS.GEOMETRY[month]);

        const dayText = new Mesh(DAYS.GEOMETRY[day], Materials.textMaterial),
            monthText = new Mesh(MONTHS.GEOMETRY[month], Materials.textMaterial);
        
        this.dateTitle = new Object3D();
        this.dateTitle.add(dayText);
        this.dateTitle.add(monthText);

        dayText.geometry.center();
        monthText.geometry.center();
        
        const dayBB = new Box3();
        dayBB.setFromObject(dayText);
        dayText.position.x = -dayBB.max.x - this.padding/2; 

        const monthBB = new Box3();
        monthBB.setFromObject(monthText);
        monthText.position.x = monthBB.max.x + this.padding / 2;

        const dateBB = new Box3();
        dateBB.setFromObject(this.dateTitle);
        this.dateTitle.position.y = Sizes.cellSize / 2 - dateBB.max.y - this.padding;
        this.add(this.dateTitle);

        const dateHeight = dateBB.getSize().y + this.padding;
        
        this.eventArea = new EventArea(
            Sizes.cellSize, 
            Sizes.cellSize - dateHeight,
            this
        );

        this.eventArea.position.y = -dateHeight/2;
        
        this.add(this.eventArea);
    }
}

class EventArea extends View {
    intersectable: boolean = true;
    
    parent: DayView;
    
    hoveringHighlight: Mesh;
    dragComponent: Mesh;
    
    dragStart: Vector2;
    
    areaBox: Box3 = new Box3().setFromObject(this);
    minuteStep: number = 5;
    minuteToPixelRatio: number = this.areaBox.getSize().y / 
        (Constants.minutesInDay / this.minuteStep);
    
    
    constructor(width: number, height: number, parent: DayView) {
        super(
            new BoxGeometry( width, height, 0), 
            new MeshBasicMaterial( { map: RTT.dayTexture } )
        );
            
        this.name = "eventArea";
        this.parent = parent;
    }
    
    mouseDown(uv: Vector2) {
        this.dragStart = uv;
    }
    
    mouseUp(uv: Vector2) {
        
        console.log("mouse is up");
        
        if (this.dragStart) {
            this.parent.notifyObservers("CreateEvent", {start: this.dragStart.y, end: uv.y})
        }
        
        if (this.dragComponent) {
            this.remove(this.dragComponent);
        }
        
        this.dragStart = null;
    }
    
    mouseDrag(uv: Vector2) {
        if (this.dragComponent)
            this.remove(this.dragComponent);
            
        const dragSize = Math.abs(uv.y - this.dragStart.y) * this.areaBox.getSize().y;
        
        const eventGeometry: BoxGeometry = 
            new BoxGeometry(this.areaBox.getSize().x, dragSize, 0);
        const eventMaterial = new MeshBasicMaterial(
            { color: 0xb3ecff, transparent: true, opacity: 0.6 }
        );
        
        this.dragComponent = new Mesh(eventGeometry, eventMaterial);
        this.dragComponent.position.x = -this.areaBox.getSize().x / 2 + 
                            this.areaBox.getSize().x / 2;
        this.dragComponent.position.y = this.areaBox.getSize().y / 2 -
                            this.areaBox.getSize().y * (1 - uv.y/2 - this.dragStart.y/2);
        this.dragComponent.position.z = 5;
        
        this.add(this.dragComponent);
    }
    
    mouseMove(uv: Vector2) {
        if (this.hoveringHighlight)
            this.remove(this.hoveringHighlight);
        
        if (this.dragStart)
            this.mouseDrag(uv);
        
        // const minuteStep = 5;
        
        const minutes = Math.floor((1 - uv.y) * (Constants.minutesInDay / this.minuteStep));
        
        // const minuteToPixelRatio = this.areaBox.getSize().y / (Constants.minutesInDay / minuteStep);
        
        const eventGeometry: BoxGeometry = 
            new BoxGeometry(this.areaBox.getSize().x, this.minuteToPixelRatio, 0);
        const eventMaterial = new MeshBasicMaterial({ color: 0xb3ecff })

        const rect: Mesh = new Mesh(eventGeometry, eventMaterial);
        rect.position.x = -this.areaBox.getSize().x / 2 + this.areaBox.getSize().x / 2;
        rect.position.y = this.areaBox.getSize().y / 2 -               // Move to top of area
                            this.areaBox.getSize().y * (1 - uv.y);     // Move to position based on coordinate
                                    
        rect.position.z = 5;
        
        this.hoveringHighlight = rect;
                                   
        this.add(this.hoveringHighlight);
    }
}