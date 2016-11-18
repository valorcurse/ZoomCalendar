import * as moment from 'moment';
type Moment = moment.Moment;

import {Vector2} from 'three';

import {DayModel} from "./day.model"
import {DayView} from "./day.view"

import {Event} from "./event/event";

// import {Observable} from "../observers";

export class Day {
    
    private _model: DayModel;
    private _view: DayView;

    constructor(moment: Moment) {
        // super();
        
        this._model = new DayModel(moment);
        this._view = new DayView(this._model);
        // this.registerObserver("EventAdded", 
            // (e) => this.addEvent(e));
    }
    
    public view() { return this._view; }
    public model() { return this._model; }
 
    public addEvent(start: Moment, end: Moment) {
        // const event = new Event(start, end);
        this.model().addEvent(start, end);
        // this.notifyObservers()
    }
}