import * as moment from 'moment';
type Moment = moment.Moment;

import {Event} from "./event/event";

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
        // const event = new Event(moment(), moment());
        
        this.events.push(event);
        this.notifyObservers("EventAdded", { event });
    }
    
    moment() {
        return this._moment;
    }
    
}