import * as moment from 'moment';
type Moment = moment.Moment;

import {Vector2} from 'three';

import {DayModel} from "./day.model"
import {DayView} from "./day.view"


export class Day {
    
    private _model: DayModel;
    private _view: DayView;

    constructor(moment: Moment) {
        this._model = new DayModel(moment);
        this._view = new DayView(this._model);
    }
    
    view() { return this._view; }
}