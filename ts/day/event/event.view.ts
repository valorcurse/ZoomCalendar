import * as moment from 'moment';
type Moment = moment.Moment;

import {Mesh, 
        // Object3D, 
        BoxGeometry, 
        MeshBasicMaterial,
        // Geometry, 
        Box3,
        // ShaderMaterial,
        // Texture,
        // OrthographicCamera,
        Vector2
} from 'three';

import {
    // RTT, 
    BasicInterface,
    // MONTHS,
    // DAYS,
    // HOURS,
    Materials,
    Components,
    // Sizes,
    Constants
} from '../../globals';

import {EventModel} from './event.model';

export class EventView extends Mesh implements BasicInterface {
    intersectable: boolean = true;
    
    model: EventModel;
    
    defaultMaterial: MeshBasicMaterial; 
    
    constructor(model: EventModel) {
        super(Components.rectGeom, Materials.rectMaterial);
        
        this.model = model;
        this.name = "event";
        
        this.draw();
    }
    
    draw() {
        const startOfDay: Moment = this.model.start().clone().startOf('day');
        
        const minutesElapsed = moment.duration(this.model.start().diff(startOfDay)).asMinutes();
        const minutesDuration = moment.duration(this.model.end().diff(this.model.start())).asMinutes();
        
        const eventAreaBox = new Box3().setFromObject(this);
        const minuteToPixelRatio = eventAreaBox.getSize().y / Constants.minutesInDay;
        const height = minutesDuration * minuteToPixelRatio;
        const yPosition = (eventAreaBox.getSize().y / 2) -      // Move to top of parent
                        (height / 2) -                          // Move to top of event
                        (minutesElapsed * minuteToPixelRatio);  // Move to correct position

        const eventGeometry: BoxGeometry = 
            new BoxGeometry(eventAreaBox.getSize().x, height, 0);

        this.position.y = yPosition;
        this.position.x = 0;
        this.position.z = 2;
        
        this.geometry = eventGeometry;
        
        this.defaultMaterial = new MeshBasicMaterial(
            { color: 0x00bfff, transparent: true, opacity: 0.6 }
        );
        this.material = this.defaultMaterial;
    }
    
    mouseMove(uv: Vector2) {
        console.log("Hovering over this event.");
        this.material = this.defaultMaterial = new MeshBasicMaterial(
            { color: 0xb3ecff, transparent: true, opacity: 0.8 }
        );
    }
}