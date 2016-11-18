import * as moment from 'moment';
type Moment = moment.Moment;

import {EventModel} from "./event.model"
import {EventView} from "./event.view"


export class Event {
    
    private _model: EventModel;
    private _view: EventView;

    constructor(start: Moment, end: Moment) {
        this._model = new EventModel(start, end);
        this._view = new EventView(this._model);
    }
    
    public view(): EventView { return this._view; }
    
    public start(): Moment {
        return this._model.start();
    }
    
    public end(): Moment {
        return this._model.end();
    }
}