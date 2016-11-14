"use strict";
var DayModel = (function () {
    function DayModel(moment) {
        this.events = [];
        this._moment = moment;
    }
    DayModel.prototype.addEvent = function (event) {
        this.events.push(event);
    };
    DayModel.prototype.moment = function () {
        return this._moment;
    };
    return DayModel;
}());
exports.DayModel = DayModel;
