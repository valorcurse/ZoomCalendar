"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var moment = require("moment");
var three_1 = require("three");
// import * as Globals from '../globals';
var globals_1 = require("../globals");
var HourMesh = (function (_super) {
    __extends(HourMesh, _super);
    function HourMesh(geometry, material) {
        var _this = _super.call(this, geometry, material) || this;
        _this.intersectable = false;
        _this.selectable = true;
        _this.defaultGeometry = geometry;
        _this.defaultMaterial = material;
        return _this;
    }
    return HourMesh;
}(three_1.Mesh));
var Hour = (function (_super) {
    __extends(Hour, _super);
    function Hour(hour) {
        var _this = _super.call(this) || this;
        _this.selected = false;
        _this.intersectable = false;
        _this.hour = hour;
        _this.name = "hour";
        _this.draw();
        return _this;
    }
    Hour.prototype.draw = function () {
        this.text = new HourMesh(globals_1.HOURS.GEOMETRY[this.hour], globals_1.Materials.textMaterial);
        this.text.geometry.center();
        var textBB = new three_1.Box3();
        textBB.setFromObject(this.text);
        this.add(this.text);
        //         var bbox = new BoundingBoxHelper( this.text, 0x0000ff);
        //         bbox.update();
        // 		this.add(bbox);
        globals_1.HOURS.INSTANCES[this.hour] = this;
    };
    return Hour;
}(three_1.Object3D));
exports.Hour = Hour;
var DailyHours = (function (_super) {
    __extends(DailyHours, _super);
    function DailyHours() {
        var _this = _super.call(this) || this;
        _this.minutesInDay = 1440; // (24 hours * 60 minutes)
        var hourPadding = (globals_1.Sizes.fontSize * 24) / 24; // Size of all letters / number of padding spots
        var hourToPixelRatio = window.innerHeight / (_this.minutesInDay / 60);
        var eventGeometry = new three_1.BoxGeometry(window.innerWidth, hourToPixelRatio, 0);
        var eventMaterial = h % 2 !== 0 ?
            new three_1.MeshBasicMaterial({ color: 0xeeeeee }) :
            new three_1.MeshBasicMaterial({ color: 0xffffff });
        for (var h = 0; h <= 23; h++) {
            var hour = new Hour(h);
            var rect = new three_1.Mesh(eventGeometry, eventMaterial);
            rect.position.y = window.innerHeight / 2 -
                hourToPixelRatio / 2 -
                hourToPixelRatio * h;
            rect.position.z = 3;
            _this.add(rect);
            var hourBB = new three_1.Box3();
            hourBB.setFromObject(hour);
            var padding = hourPadding + (hourBB.getSize().y - globals_1.Sizes.fontSize);
            hour.position.x = -window.innerWidth / 2 + hourBB.getSize().x / 2;
            hour.position.y = window.innerHeight / 2 -
                hourBB.getSize().y / 2 -
                h * hourToPixelRatio -
                (hourToPixelRatio - hourBB.getSize().y) / 2;
            hour.position.z = 15;
            _this.add(hour);
        }
        return _this;
    }
    return DailyHours;
}(three_1.Mesh));
exports.DailyHours = DailyHours;
var DayView = (function (_super) {
    __extends(DayView, _super);
    function DayView(day) {
        var _this = _super.call(this, globals_1.Components.rectGeom, globals_1.Materials.rectMaterial) || this;
        _this.margin = 0.1;
        _this.padding = 0.5;
        // cellSize: number = 30;
        // material: MeshBasicMaterial = Materials.rectMaterial;
        _this.geometry = globals_1.Components.rectGeom;
        _this.box = new three_1.Box3().setFromObject(_this);
        _this.intersectable = false;
        _this.selectable = true;
        _this.minutesInDay = 1440; // (24 hours * 60 minutes)
        _this.uniforms = {
            transform: { type: "f", value: 0 }
        };
        _this.shaderMaterial = new three_1.ShaderMaterial({
            uniforms: _this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent
        });
        _this.name = "day";
        _this.day = day;
        _this.draw();
        return _this;
    }
    DayView.prototype.addEvent = function (event) {
        var startOfDay = event.start().clone().startOf('day');
        var minutesElapsed = moment.duration(event.start().diff(startOfDay)).asMinutes();
        var minutesDuration = moment.duration(event.end().diff(event.start())).asMinutes();
        var eventAreaBox = new three_1.Box3().setFromObject(this.eventArea);
        var minuteToPixelRatio = eventAreaBox.getSize().y / this.minutesInDay;
        var height = minutesDuration * minuteToPixelRatio;
        var yPosition = (eventAreaBox.getSize().y / 2) -
            (height / 2) -
            (minutesElapsed * minuteToPixelRatio); // Move to correct position
        var eventGeometry = new three_1.BoxGeometry(10, height, 0);
        var rect = new HourMesh(eventGeometry, globals_1.Materials.hourMaterial);
        rect.position.y = yPosition;
        rect.position.x = 0;
        rect.position.z = 5;
        this.eventArea.add(rect);
    };
    DayView.prototype.draw = function () {
        var weekOfMonth = this.day.moment().week();
        var dayOfMonth = this.day.moment().day();
        this.position.x = dayOfMonth * globals_1.Sizes.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * globals_1.Sizes.cellSize + -weekOfMonth * this.margin;
        var day = this.day.moment().date() - 1, month = this.day.moment().month();
        // console.log(MONTHS.GEOMETRY[month]);
        var dayText = new three_1.Mesh(globals_1.DAYS.GEOMETRY[day], globals_1.Materials.textMaterial), monthText = new three_1.Mesh(globals_1.MONTHS.GEOMETRY[month], globals_1.Materials.textMaterial);
        this.dateTitle = new three_1.Object3D();
        this.dateTitle.add(dayText);
        this.dateTitle.add(monthText);
        dayText.geometry.center();
        monthText.geometry.center();
        var dayBB = new three_1.Box3();
        dayBB.setFromObject(dayText);
        dayText.position.x = -dayBB.max.x - this.padding / 2;
        var monthBB = new three_1.Box3();
        monthBB.setFromObject(monthText);
        monthText.position.x = monthBB.max.x + this.padding / 2;
        var dateBB = new three_1.Box3();
        dateBB.setFromObject(this.dateTitle);
        this.dateTitle.position.y = globals_1.Sizes.cellSize / 2 - dateBB.max.y - this.padding;
        this.add(this.dateTitle);
        var dateHeight = dateBB.getSize().y + this.padding;
        var event = new EventArea(globals_1.Sizes.cellSize, globals_1.Sizes.cellSize - dateHeight);
        this.add(event);
        // this.eventArea = new Mesh( 
        //     new BoxGeometry( Sizes.cellSize, Sizes.cellSize - dateHeight, 0)
        // );
        // this.eventArea.name = "eventArea";
        // this.eventArea.position.y =  -dateHeight/2;
        // this.add(this.eventArea);
        // var eventAreaBox = new Box3();
        // eventAreaBox.setFromObject(this.eventArea);
        // this.eventArea.material = new MeshBasicMaterial( { map: RTT.dayTexture } );
    };
    DayView.prototype.mouseover = function (uv) {
        if (this.hoveringHighlight)
            this.eventArea.remove(this.hoveringHighlight);
        this.uniforms.transform.value = uv.y * 10;
        var minuteStep = 5;
        var minutes = Math.floor((1 - uv.y) * (this.minutesInDay / minuteStep));
        var eventAreaBox = new three_1.Box3().setFromObject(this.eventArea);
        var minuteToPixelRatio = eventAreaBox.getSize().y / (this.minutesInDay / minuteStep);
        var eventGeometry = new three_1.BoxGeometry(eventAreaBox.getSize().x, minuteToPixelRatio, 0);
        var eventMaterial = new three_1.MeshBasicMaterial({ color: 0xb3ecff });
        var rect = new three_1.Mesh(eventGeometry, eventMaterial);
        rect.position.x = -eventAreaBox.getSize().x / 2 + eventAreaBox.getSize().x / 2;
        rect.position.y = eventAreaBox.getSize().y / 2 -
            eventAreaBox.getSize().y * (1 - uv.y); // Move to position based on coordinate
        rect.position.z = 5;
        this.hoveringHighlight = rect;
        this.eventArea.add(this.hoveringHighlight);
    };
    return DayView;
}(three_1.Mesh));
exports.DayView = DayView;
var EventArea = (function (_super) {
    __extends(EventArea, _super);
    function EventArea(width, height) {
        var _this = _super.call(this, new three_1.BoxGeometry(width, height, 0), new three_1.MeshBasicMaterial({ map: globals_1.RTT.dayTexture })) || this;
        _this.intersectable = true;
        _this.name = "eventArea";
        // this.position.y =  -dateHeight/2;
        var eventAreaBox = new three_1.Box3();
        eventAreaBox.setFromObject(_this);
        return _this;
    }
    return EventArea;
}(three_1.Mesh));
