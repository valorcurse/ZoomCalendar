import * as moment from 'moment';
type Moment = moment.Moment;

import {Event} from "./event/event";
import {EventView} from "./event/event.view";

import {Observable} from "../observers";

export class DayModel extends Observable {
    _moment: Moment;
    events: Event[] = [];
    
    constructor(moment: Moment) {
        super();
        
        this._moment = moment;
    }
    
    addEvent(start: Moment, end: Moment) {
        const event = new Event(start, end);
        
        this.events.push(event);
        const view: EventView = event.view();
        console.log(view);
        this.notifyObservers("EventAdded", view);
    }
    
    moment() {
        return this._moment.clone();
    }
    
}