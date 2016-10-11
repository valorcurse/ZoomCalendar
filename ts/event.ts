import * as moment from 'moment';
type Moment = moment.Moment;

export class Event {

    start: Moment;
    end: Moment;

    constructor(start: Moment, end: Moment) {
        this.start = start;
        this.end = end;
    }
}
