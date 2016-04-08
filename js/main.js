var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/moment/moment.d.ts"/>
var Config;
(function (Config) {
    var HOURS;
    (function (HOURS) {
        HOURS.NUMBER_OF = 24;
        HOURS.GEOMETRY = [];
        HOURS.INSTANCES = {};
    })(HOURS = Config.HOURS || (Config.HOURS = {}));
    var DAYS;
    (function (DAYS) {
        DAYS.NUMBER_OF = 31;
        DAYS.GEOMETRY = [];
    })(DAYS = Config.DAYS || (Config.DAYS = {}));
    var MONTHS;
    (function (MONTHS) {
        MONTHS.NUMBER_OF = 12;
        MONTHS.GEOMETRY = [];
    })(MONTHS = Config.MONTHS || (Config.MONTHS = {}));
})(Config || (Config = {}));
// var font: THREE.Font;
var cellSize = 30;
var dateSize = cellSize / 16;
var padding = 0.5;
var hoursArea = cellSize - padding * 2 - dateSize * 3;
var fontSize = hoursArea / 24;
var rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
var rectGeom = new THREE.BoxGeometry(cellSize, cellSize, 0);
var textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000,
    shading: THREE.FlatShading
});
var hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
var hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);
var days = [];
var shiftPressed = false;
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
///<reference path="../typings/main/ambient/moment/moment.d.ts"/>
///<reference path="config.ts"/>
var HourMesh = (function (_super) {
    __extends(HourMesh, _super);
    function HourMesh(geometry, material) {
        _super.call(this, geometry, material);
        this.hoverable = true;
        this.selectable = true;
        this.defaultGeometry = geometry;
        this.defaultMaterial = material;
    }
    return HourMesh;
}(THREE.Mesh));
var Hour = (function (_super) {
    __extends(Hour, _super);
    function Hour(date) {
        _super.call(this);
        this.selected = false;
        this.hoverable = true;
        this.date = date.clone();
        this.name = "hour";
        this.draw();
    }
    Hour.prototype.draw = function () {
        var currentHour = this.date.hour();
        this.rect = new HourMesh(hourBoxGeom, hourMaterial);
        // this.rect.geometry.center();
        this.rect.position.y = -(cellSize / 2) + (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding;
        this.rect.position.x = fontSize / 2;
        this.rect.position.z = 5;
        this.add(this.rect);
        this.text = new HourMesh(Config.HOURS.GEOMETRY[currentHour], textMaterial);
        this.text.geometry.center();
        var textBB = new THREE.Box3();
        textBB.setFromObject(this.text);
        // this.text.position.x = textBB.max.x; 
        this.text.position.x = -cellSize / 2 + textBB.max.x;
        this.text.position.y = -cellSize / 2 + (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding - fontSize / 2 + textBB.max.y;
        this.add(this.text);
        // this.onMouseHover = function() {
        //     if (!this.selected) {
        //         rect.material = rect.material.clone();
        //         rect.material.color = new THREE.Color(0x00ff00);
        //     }
        // }
        // this.onMouseOut = function() {
        //     // this.rect.material = this.rect.defaultMaterial;
        // }
        Config.HOURS.INSTANCES[+this.date] = this;
    };
    // onMouseClick() {
    Hour.prototype.select = function (selection) {
        this.selected = selection;
        console.log("Hour clicked:");
        console.log(this.date.format("DD MMM HH:mm"));
        console.log(this.selected);
        if (this.selected) {
            this.rect.material = this.rect.defaultMaterial.clone();
            this.rect.material.color = new THREE.Color(0x0000ff);
        }
        else {
            this.rect.material = this.rect.defaultMaterial;
        }
        // console.log(this.date.format("DD MMM HH:mm"));    
    };
    Hour.prototype.onMouseHover = function () {
        if (!this.selected && this.rect.material === this.rect.defaultMaterial) {
            this.rect.material = this.rect.defaultMaterial.clone();
            this.rect.material.color = new THREE.Color(0xaaaaaa);
        }
        // console.log(this.date.format("DD MMM HH:mm"));
        // console.log(this.date);
    };
    Hour.prototype.onMouseOut = function () {
        if (!this.selected) {
            this.rect.material = this.rect.defaultMaterial;
        }
    };
    return Hour;
}(THREE.Object3D));
var Day = (function (_super) {
    __extends(Day, _super);
    function Day(date) {
        _super.call(this, rectGeom, rectMaterial);
        this.margin = 0.1;
        this.padding = 0.5;
        this.cellSize = 30;
        this.material = rectMaterial;
        this.geometry = rectGeom;
        this.hoverable = false;
        this.selectable = true;
        this.date = date;
        this.draw();
    }
    Day.prototype.draw = function () {
        this.name = "day";
        var weekOfMonth = this.date.week();
        var dayOfMonth = this.date.day();
        this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
        var day = this.date.date() - 1, month = this.date.month();
        var dayText = new THREE.Mesh(Config.DAYS.GEOMETRY[day], textMaterial), monthText = new THREE.Mesh(Config.MONTHS.GEOMETRY[month], textMaterial);
        var dateText = new THREE.Object3D();
        dateText.add(dayText);
        dateText.add(monthText);
        dayText.geometry.center();
        monthText.geometry.center();
        var dayBB = new THREE.Box3();
        dayBB.setFromObject(dayText);
        dayText.position.x = -dayBB.max.x - this.padding / 2;
        var monthBB = new THREE.Box3();
        monthBB.setFromObject(monthText);
        monthText.position.x = monthBB.max.x + this.padding / 2;
        var dateBB = new THREE.Box3();
        dateBB.setFromObject(dateText);
        dateText.position.y = cellSize / 2 - dateBB.max.y - this.padding;
        this.add(dateText);
        for (var i = this.date.clone().startOf("day"); i.isBefore(this.date.clone().endOf("day")); i.add(1, "hours")) {
            this.add(new Hour(i));
        }
    };
    return Day;
}(THREE.Mesh));
///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/d3/d3.d.ts"/>
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
/// <reference path="config.ts"/>
/// <reference path="day.ts"/>
var Mouse;
(function (Mouse) {
    Mouse.position = new THREE.Vector2();
    var click;
    (function (click) {
        click.selection = { start: null, end: null };
    })(click = Mouse.click || (Mouse.click = {}));
    var hover;
    (function (hover) {
        hover.raycaster = new THREE.Raycaster();
        hover.intersects = [];
        hover.oldIntersects = [];
    })(hover = Mouse.hover || (Mouse.hover = {}));
})(Mouse || (Mouse = {}));
var ZoomCalendar = (function (_super) {
    __extends(ZoomCalendar, _super);
    // removeRow: () => void;
    function ZoomCalendar() {
        var _this = this;
        _super.call(this, { antialias: true });
        this.scene = new THREE.Scene();
        this.sceneSize = { "width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97 };
        this.aspect = this.sceneSize.width / this.sceneSize.height;
        this.year = 2016;
        this.month = 1;
        this.DZOOM = 5;
        this.zoom = d3.behavior.zoom()
            .scaleExtent([0.06, 0.45])
            .scale(0.06)
            .translate([-975, 100]);
        this.zoomed = function () {
            var x = _this.zoom.translate()[0], y = _this.zoom.translate()[1], z = _this.zoom.scale();
            _this.translate(x, y, z);
        };
        this.translate = function (x, y, z) {
            x = x - _this.sceneSize.width / 2;
            y = y - _this.sceneSize.height / 2;
            _this.camera.left = -_this.DZOOM / z * _this.aspect - x / _this.sceneSize.width * _this.DZOOM / z * 2 * _this.aspect;
            _this.camera.right = _this.DZOOM / z * _this.aspect - x / _this.sceneSize.width * _this.DZOOM / z * 2 * _this.aspect;
            _this.camera.top = _this.DZOOM / z + y / _this.sceneSize.height * _this.DZOOM / z * 2;
            _this.camera.bottom = -_this.DZOOM / z + y / _this.sceneSize.height * _this.DZOOM / z * 2;
            _this.camera.updateProjectionMatrix();
        };
        this.onClick = function (event) {
            if (Mouse.hover.intersects.length <= 0)
                return;
            var mouseDeltaMovement = Mouse.click.position.x - event.clientX +
                Mouse.click.position.y - event.clientY;
            // Ignore click if mouse moved
            if (mouseDeltaMovement !== 0)
                return;
            var intersect = Mouse.hover.intersects[0];
            var objectsParent = intersect.object.parent;
            if (objectsParent instanceof Hour) {
                var hour = objectsParent;
                var previousSelection = Mouse.click.selection.start;
                if (previousSelection)
                    previousSelection.select(false);
                if (hour !== previousSelection) {
                    Mouse.click.selection.start = hour;
                    Mouse.click.selection.start.select(true);
                }
            }
            _this.refreshSelection();
        };
        this.onMouseMove = function (event) {
            event.preventDefault();
            Mouse.position.x = (event.clientX / window.innerWidth) * 2 - 1;
            Mouse.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
            Mouse.hover.raycaster.setFromCamera(Mouse.position, _this.camera);
            Mouse.hover.intersects = Mouse.hover.raycaster.intersectObjects(_this.scene.children, true);
            if (!Mouse.click.selection.start)
                return;
            // Select last hour for selection
            for (var i = 0; i < Mouse.hover.intersects.length; i++) {
                var intersect = Mouse.hover.intersects[i];
                if (intersect.object.parent instanceof Hour) {
                    var hour = intersect.object.parent;
                    Mouse.click.selection.end = hour;
                }
            }
            // Choose the first date in chronological order
            var dates = [Mouse.click.selection.start.date.clone(),
                Mouse.click.selection.end.date.clone()];
            dates.sort();
            // Hover over all hour between start and end
            for (var d = dates[0]; d.isSameOrBefore(dates[1]); d.add(1, "hour")) {
                var selectedHour = Config.HOURS.INSTANCES[+d];
                selectedHour.onMouseHover();
                if (Mouse.hover.oldIntersects.indexOf(selectedHour) < 0) {
                    Mouse.hover.oldIntersects.push(selectedHour);
                }
            }
            _this.refreshSelection();
        };
        this.isInBetween = function (date, start, end) {
            return date.isBetween(start, end) || date.isBetween(end, start);
        };
        this.refreshSelection = function () {
            // Unhover hours which are no longer being hovered
            for (var index = 0; index < Mouse.hover.oldIntersects.length; index++) {
                var notInBetween = function (intersect) {
                    var inBetween = _this.isInBetween(intersect.date, Mouse.click.selection.start.date, Mouse.click.selection.end.date);
                    // intersect.date.isAfter(Mouse.click.selection.end.date) ||
                    // intersect.date.isBefore(Mouse.click.selection.start.date);
                    // 	let inBetween = intersect.date.isBetween(Mouse.click.selection.start.date,
                    // 		Mouse.click.selection.end.date);
                    if (!inBetween)
                        intersect.onMouseOut();
                    return inBetween;
                };
                Mouse.hover.oldIntersects = Mouse.hover.oldIntersects.filter(notInBetween);
            }
        };
        this.draw = function () {
            requestAnimationFrame(_this.draw);
            _this.render(_this.scene, _this.camera);
        };
        // this.scene = new THREE.Scene();
        this.scene.updateMatrixWorld(true);
        // var aspect = this.sceneSize.width / this.sceneSize.height;
        this.camera = new THREE.OrthographicCamera(0, 2 * this.DZOOM * this.aspect, 0, -2 * this.DZOOM, -1000, 1000);
        this.camera.updateProjectionMatrix();
        this.setSize(this.sceneSize.width, this.sceneSize.height);
        this.setClearColor(0xcccccc, 1);
        this.draw();
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('click', this.onClick, false);
        document.addEventListener('mousedown', this.onMouseDown, false);
        var currentDate = new Date(this.year, this.month);
        this.dates = d3.time.days(moment(currentDate).startOf("year").toDate(), moment(currentDate).endOf("month").toDate());
        this.view = d3.select(this.domElement);
        var loader = new THREE.FontLoader();
        loader.load('fonts/helvetiker_regular.typeface.js', function (f) {
            _this.font = f;
            _this.init();
        });
    }
    ZoomCalendar.prototype.init = function () {
        this.generateTextGeometry();
        this.createComponents();
        this.draw();
        this.zoom.on('zoom', this.zoomed);
        this.view.call(this.zoom)
            .on("dblclick.zoom", null) // disable zoom in on double-click
        ;
        this.zoomed();
    };
    ZoomCalendar.prototype.onMouseDown = function (event) {
        console.log("Mouse is down.");
        Mouse.click.position = { x: event.clientX, y: event.clientY };
    };
    ZoomCalendar.prototype.createComponents = function () {
        for (var i = 0; i < this.dates.length; i++) {
            var date = moment(this.dates[i]);
            var newDay = new Day(date);
            this.scene.add(newDay);
        }
        var cameraBB = new THREE.Box3();
        cameraBB.setFromObject(this.scene);
        this.camera.position.set(-cameraBB.max.x, cameraBB.max.y * 2, 0); // TODO: Find out the correct values
        this.camera.updateProjectionMatrix();
    };
    ZoomCalendar.prototype.generateTextGeometry = function () {
        for (var h = 0; h < Config.HOURS.NUMBER_OF; h++) {
            var hourGeom = new THREE.TextGeometry(h, {
                font: this.font,
                size: fontSize,
                dynamic: false
            });
            Config.HOURS.GEOMETRY.push(hourGeom);
        }
        for (var d = 1; d <= Config.DAYS.NUMBER_OF; d++) {
            var dayGeom = new THREE.TextGeometry(d, {
                font: this.font,
                size: dateSize,
                dynamic: false
            });
            Config.DAYS.GEOMETRY.push(dayGeom);
        }
        for (var m = 0; m < this.dates.length; m++) {
            var date = moment(this.dates[m]);
            var monthGeom = new THREE.TextGeometry(date.format("MMM"), {
                font: this.font,
                size: dateSize,
                dynamic: false
            });
            Config.MONTHS.GEOMETRY.push(monthGeom);
        }
    };
    return ZoomCalendar;
}(THREE.WebGLRenderer));
/// <reference path="zoomcalendar.ts"/>
document.body.appendChild(new ZoomCalendar().domElement);
