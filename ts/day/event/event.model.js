"use strict";
var Event = (function () {
    function Event(start, end) {
        this._start = start;
        this._end = end;
    }
    Event.prototype.start = function () {
        return this._start;
    };
    Event.prototype.end = function () {
        return this._end;
    };
    return Event;
}());
exports.Event = Event;
