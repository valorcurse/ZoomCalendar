import * as moment from 'moment';
type Moment = moment.Moment;

import {Event} from "./event/event.model";

export class DayModel {
    _moment: Moment;
    events: Event[] = [];
    
    constructor(moment: Moment) {
        this._moment = moment;
    }
    
    addEvent(event: Event) {
        this.events.push(event);
    }
    
    moment() {
        return this._moment;
    }
    
}