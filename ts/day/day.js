"use strict";
var day_model_1 = require("./day.model");
var day_view_1 = require("./day.view");
var Day = (function () {
    function Day(moment) {
        this._model = new day_model_1.DayModel(moment);
        this._view = new day_view_1.DayView(this._model);
    }
    Day.prototype.view = function () { return this._view; };
    return Day;
}());
exports.Day = Day;
