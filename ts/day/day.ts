import * as moment from 'moment';
type Moment = moment.Moment;

import {Vector2} from 'three';

import {DayModel} from "./day.model"
import {DayView} from "./day.view"

import {Event, Period} from "./event/event";
import {Constants} from "../globals";

// import {Observable} from "../observers";

export class Day {
    
    private _model: DayModel;
    private _view: DayView;

    constructor(moment: Moment) {
        this._model = new DayModel(moment);
        this._view = new DayView(this._model);
        // this._view.registerObserver("CreateEvent", 
            // (start: number, end: number) => 
            // this.addEvent(start, end)
        // );
        
    }
    
    public view() { return this._view; }
    public model() { return this._model; }
 
    public addEvent(start: Moment | number, end: Moment | number) {
        const period: Period = <Period>{};
        
        if (typeof start === 'number') {
            const minutes = Constants.minutesInDay * start;
            period.start = this.model().moment().add(minutes, "minutes");
        } else {
            period.start = start;
        }
        
        if (typeof end === 'number') {
            const minutes = Constants.minutesInDay * end;
            period.end = this.model().moment().add(minutes, "minutes");
        } else {
            period.end = end;
        }
        
        this.model().addEvent(period.start, period.end);
    }
}