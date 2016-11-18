import * as moment from 'moment';
type Moment = moment.Moment;

import {
    Mesh
} from 'three';

import {Day} from "../day";

export class EventModel {

    private _start: Moment;
    private _end: Moment;
    private _day: Day;

    constructor(start: Moment, end: Moment) {
        this._start = start;
        this._end = end;
    }
    
    public start(): Moment {
        return this._start;
    }
    
    public end(): Moment {
        return this._end;
    }
}
