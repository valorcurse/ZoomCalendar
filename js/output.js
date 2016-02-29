// const config = {
//     "HOURS": {
//         "NUMBER_OF": 24,
//         "GEOMETRY": [],
//         "INSTANCES": {}
//     },
//     "DAYS": {
//         "NUMBER_OF": 31,
//         "GEOMETRY": []
//     },
//     "MONTHS": {
//         "NUMBER_OF": 12,
//         "GEOMETRY": []
//     }
// };
///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
var Config;
(function (Config) {
    var HOURS;
    (function (HOURS) {
        HOURS.NUMBER_OF = 24;
        HOURS.GEOMETRY = [];
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
var font;
var cellSize = 30;
var dateSize = cellSize / 16;
var padding = 0.5;
var hoursArea = cellSize - padding * 2 - dateSize * 3;
var fontSize = hoursArea / 24;
var rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
var rectGeom = new THREE.BoxGeometry(cellSize, cellSize, 0);
var textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000,
    overdraw: true,
    shading: THREE.FlatShading
});
var generateTextGeometry = function () {
    for (var h = 1; h <= Config.HOURS.NUMBER_OF; h++) {
        var hourGeom = new THREE.TextGeometry(h, {
            font: font,
            size: fontSize,
            dynamic: false
        });
        Config.HOURS.GEOMETRY.push(hourGeom);
    }
    for (var d = 1; d <= Config.DAYS.NUMBER_OF; d++) {
        var dayGeom = new THREE.TextGeometry(d, {
            font: font,
            size: dateSize,
            dynamic: false
        });
        Config.DAYS.GEOMETRY.push(dayGeom);
    }
    var dates = d3.time.months(moment(currentDate).startOf("year"), moment(currentDate).endOf("year"));
    // console.log(dates);
    for (var m = 0; m < dates.length; m++) {
        var date = moment(dates[m]);
        var monthGeom = new THREE.TextGeometry(date.format("MMM"), {
            font: font,
            size: dateSize,
            dynamic: false
        });
        Config.MONTHS.GEOMETRY.push(monthGeom);
    }
};
var hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
var hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);
var days = [];
var shiftPressed = false;
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
///<reference path="config.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HourMesh = (function (_super) {
    __extends(HourMesh, _super);
    function HourMesh(geometry, material) {
        _super.call(this, geometry, material);
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
        this.date = date;
        this.name = "hour";
        draw();
    }
    Hour.prototype.draw = function () {
        var currentHour = +this.date.format("H");
        this.rect = new HourMesh(hourBoxGeom, hourMaterial);
        this.rect.position.y = -(cellSize / 2) + (Config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding;
        this.rect.position.x = fontSize / 2;
        this.rect.position.z = 5;
        // this.rect.onMouseHover = function() { this.onMouseHover(); }
        // this.rect.onMouseOut = function() { this.onMouseOut(); }
        // this.rect.onMouseClick = function() { this.onMouseClick(); }
        this.add(rect);
        this.text = new HourMesh(config.HOURS.GEOMETRY[currentHour], textMaterial);
        this.text.position.x = -cellSize / 2;
        this.text.position.y = -cellSize / 2 + (config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding - fontSize / 2;
        // this.text.onMouseHover = function() { this.onMouseHover(); }
        // this.text.onMouseOut = function() { this.onMouseOut(); }
        // this.text.onMouseClick = function() { this.onMouseClick(); }
        this.add(text);
        // this.onMouseHover = function() {
        //     if (!this.selected) {
        //         rect.material = rect.material.clone();
        //         rect.material.color = new THREE.Color(0x00ff00);
        //     }
        // }
        // this.onMouseOut = function() {
        //     // this.rect.material = this.rect.defaultMaterial;
        // }
        // this.onMouseClick = function() {
        //     this.selected = !this.selected;
        //     console.log("Hour clicked:");
        //     console.log(this.date);
        //     console.log("############################");
        //     if (this.selected) {
        //         rect.material = rect.material.clone();
        //         this.rect.material.color = new THREE.Color(0x0000ff);
        //     } else {
        //         this.rect.material = rect.defaultMaterial;
        //     }
        // }
        config.HOURS.INSTANCES[date] = this;
    };
    return Hour;
}(THREE.Object3D));
var Day = (function (_super) {
    __extends(Day, _super);
    function Day(date) {
        _super.call(this, this.geometry, this.material);
        this.margin = 0.1;
        this.cellSize = 30;
        this.material = rectMaterial;
        this.geometry = rectGeom;
        var weekOfMonth = date.week();
        var dayOfMonth = date.day();
        this.position.x = dayOfMonth * this.cellSize + dayOfMonth * this.margin;
        this.position.y = -weekOfMonth * this.cellSize + -weekOfMonth * this.margin;
        this.name = "day";
        draw();
    }
    Day.prototype.draw = function () {
        // var rectMesh = new THREE.Mesh(rectGeom, rectMaterial);
        this.position.x = x;
        this.position.y = y;
        // this.name = "day";
        this.onMouseHover = function () {
            // rectMesh.material = rectMesh.material.clone();
            // rectMesh.material.color = new THREE.Color( 0xff0000 );
        };
        this.onMouseOut = function () {
            // rectMesh.material = rectMesh.defaultMaterial;
        };
        this.onMouseClick = function () { };
        var day = date.date() - 1, month = date.month();
        var dayMesh = new THREE.Mesh(config.DAYS.GEOMETRY[day], textMaterial), monthMesh = new THREE.Mesh(config.MONTHS.GEOMETRY[month], textMaterial);
        dayMesh.defaultMaterial = textMaterial;
        monthMesh.defaultMaterial = textMaterial;
        var dayBB = new THREE.Box3();
        dayBB.setFromObject(dayMesh);
        monthMesh.position.x = dayBB.max.x + padding * 2;
        var textMesh = new THREE.Object3D();
        textMesh.add(dayMesh);
        textMesh.add(monthMesh);
        var bb = new THREE.Box3();
        bb.setFromObject(textMesh);
        textMesh.position.x = -cellSize / 4;
        textMesh.position.y = cellSize / 2 - bb.max.y - padding;
        this.add(textMesh);
        for (var i = date.clone().startOf("day"); +i < +date.clone().endOf("day"); i.add(1, "hours")) {
            // console.log("Creating hour:");
            // console.log(i.toDate());
            // console.log(i.format("HH:mm") + " = " + date.clone().endOf("day").format("HH:mm"));
            // startDate.add(1, "hours");
            // startDate;
            // console.log(startDate);
            // console.log(startDate.isBefore(date.endOf("day")));
            this.add(hour(i));
        }
    };
    return Day;
}(THREE.Mesh));
///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/d3/d3.d.ts"/>
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
/// <reference path="day.ts"/>
// var stats = new Stats();
// stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb
var mouse = new THREE.Vector2();
// align top-left
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';
// document.body.appendChild( stats.domElement );
var view;
var DZOOM = 5;
// var font;
var scene = new THREE.Scene();
scene.updateMatrixWorld(true);
var sceneSize = { "width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97 };
var aspect = sceneSize.width / sceneSize.height;
// var camera = new THREE.OrthographicCamera(0, 2 * DZOOM * aspect, 0, -2 * DZOOM, -1000, 1000);
var camera = new THREE.OrthographicCamera(0, sceneSize.width, 0, sceneSize.width, -1000, 1000);
camera.updateProjectionMatrix();
// camera.position.set(-50, 50, 0);
// camera.position.set(scene.position);
document.addEventListener('mousemove', onMouseMove, false);
var raycaster = new THREE.Raycaster();
var intersects = [];
var intersected = [];
var selection = { start: null, end: null };
function onMouseMove(event) {
    console.log(event);
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, true);
    for (var j = 0; j < intersected.length; j++) {
        if (intersects.indexOf(intersected[j]) <= 0 && typeof intersected[j].defaultMaterial !== 'undefined') {
            intersected[j].onMouseOut();
            intersected.splice(j, 1);
        }
    }
    for (var i = 0; i < intersects.length; i++) {
        var intersect = intersects[i].object;
        intersect.onMouseHover();
        intersected.push(intersect);
    }
    console.log(intersects[0].object.parent.date);
    // 	if (selection.start && intersects[0].object.date) {
    //         var intersectedHour = intersects[0].object.date.clone();
    //         console.log(selection.start.clone());
    //         console.log(intersectedHour);
    //         // console.log(selection.start.clone().toDate() <= hour);
    //         console.log(intersectedHour.isAfter(selection.start));
    //         console.log("--------------------------------------");
    // for (var h = selection.start.clone(); intersectedHour.isAfter(h); h.add(1, "hours")) {
    //     console.log(h.toDate());
    //     // console.log(intersectedHour);
    //     // console.log(h <= intersectedHour);
    //     console.log("--------------------------------------");
    //     config.HOURS.INSTANCES[h].onMouseHover();
    // }
    // if (+selection.start.clone() <= +hour) {
    //   // && hour <= intersect.parent.date.toDate()) {
    //     console.log(selection.start);
    //     config.HOURS.INSTANCES[hour].onMouseHover();
    // } else {
    //     config.HOURS.INSTANCES[hour].onMouseOut();
    // }
    // 	}
    render();
}
document.addEventListener('click', onKeyPressed, false);
function onKeyPressed(event) {
    if (intersects.length <= 0)
        return;
    var intersect = intersects[0].object;
    intersect.onMouseClick();
    // console.log(intersect.parent.date);
    if (intersect.parent.date) {
        // console.log(intersect.parent.date);
        if (!selection.start) {
            console.log("Setting start date:");
            console.log(intersect.parent.date.toDate());
            console.log("#############################");
            selection.start = intersect.parent.date;
        }
        else {
            console.log("Setting end date: " + intersect.parent.date);
            selection.end = intersect.parent.date;
        }
    }
}
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sceneSize.width, sceneSize.height);
renderer.setClearColor(0xcccccc, 1);
document.body.appendChild(renderer.domElement);
var render = function () {
    return renderer.render(scene, camera);
};
var year = 2016, month = 1, currentDate = new Date(year, month);
// var dates = d3.time.days(moment(currentDate).startOf("month"), moment(currentDate).add(1, "month").endOf("month"))
var dates = d3.time.days(moment(currentDate).startOf("year"), moment(currentDate).endOf("month"));
// var dates = d3.time.days(moment(currentDate).startOf("year"), moment(currentDate).endOf("year"))
var draw = function () {
    for (var i = 0; i < dates.length; i++) {
        var date = moment(dates[i]);
        var newDay = day(date).create();
        scene.add(newDay);
    }
    var cameraBB = new THREE.Box3();
    cameraBB.setFromObject(scene);
    camera.position.set(-cameraBB.max.x, cameraBB.max.y * 2, 0); // TODO: Find out the correct values
    camera.updateProjectionMatrix();
};
var loader = new THREE.FontLoader();
loader.load('fonts/helvetiker_regular.typeface.js', function (f) {
    font = f;
    generateTextGeometry();
    draw();
    render();
    zoomed();
});
view = d3.select(renderer.domElement);
var zoom = d3.behavior.zoom()
    .scaleExtent([0.115, 0.45])
    .scale(0.115);
function translate(x, y, z) {
    x = x - sceneSize.width / 2;
    y = y - sceneSize.height / 2;
    camera.left = -DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
    camera.right = DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
    camera.top = DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
    camera.bottom = -DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
    camera.updateProjectionMatrix();
}
var aspectRatio = sceneSize.width / sceneSize.height;
var previousTranslation = null;
var zoomed = function () {
    var x = zoom.translate()[0], y = zoom.translate()[1], z = zoom.scale();
    return requestAnimationFrame(function () {
        translate(x, y, z);
        return render();
    });
};
zoom.on('zoom', zoomed);
view.call(zoom)
    .on("dblclick.zoom", null) // disable zoom in on double-click
;
