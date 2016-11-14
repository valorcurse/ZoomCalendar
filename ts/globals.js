"use strict";
// import {Day} from "./day.model";
var three_1 = require("three");
// export module Config {
var HOURS;
(function (HOURS) {
    HOURS.NUMBER_OF = 24;
    HOURS.GEOMETRY = [];
    HOURS.INSTANCES = {};
})(HOURS = exports.HOURS || (exports.HOURS = {}));
var DAYS;
(function (DAYS) {
    DAYS.NUMBER_OF = 31;
    DAYS.GEOMETRY = [];
})(DAYS = exports.DAYS || (exports.DAYS = {}));
var MONTHS;
(function (MONTHS) {
    MONTHS.NUMBER_OF = 12;
    MONTHS.GEOMETRY = [];
})(MONTHS = exports.MONTHS || (exports.MONTHS = {}));
var Sizes;
(function (Sizes) {
    Sizes.cellSize = 30;
    Sizes.dateSize = Sizes.cellSize / 16;
    Sizes.padding = 0.5;
    Sizes.hoursArea = Sizes.cellSize - Sizes.padding * 2 - Sizes.dateSize * 3;
    Sizes.fontSize = Sizes.hoursArea / 24;
})(Sizes = exports.Sizes || (exports.Sizes = {}));
var RTT;
(function (RTT) {
})(RTT = exports.RTT || (exports.RTT = {}));
var Materials;
(function (Materials) {
    Materials.rectMaterial = new three_1.MeshBasicMaterial({ color: 0xffffff });
    Materials.hourMaterial = new three_1.MeshBasicMaterial({ color: 0xdddddd });
    Materials.textMaterial = new three_1.MeshBasicMaterial({
        color: 0x00000,
        shading: three_1.FlatShading
    });
})(Materials = exports.Materials || (exports.Materials = {}));
var Components;
(function (Components) {
    Components.rectGeom = new three_1.BoxGeometry(Sizes.cellSize, Sizes.cellSize, 0);
    Components.hourBoxGeom = new three_1.BoxGeometry(Sizes.cellSize - Sizes.padding * 2 - fontSize, fontSize, 0);
})(Components = exports.Components || (exports.Components = {}));
exports.shiftPressed = false;
