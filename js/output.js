///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
function hour(date) {
    var newHour = new THREE.Object3D();
    newHour.date = date;
    newHour.selected = false;
    newHour.name = "hour";
    var currentHour = date.format("H");
    newHour.rect = new THREE.Mesh(hourBoxGeom, hourMaterial);
    newHour.rect.position.y = -(cellSize / 2) + (config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding;
    newHour.rect.position.x = fontSize / 2;
    newHour.rect.position.z = 5;
    newHour.rect.defaultMaterial = hourMaterial;
    newHour.rect.onMouseHover = function () { newHour.onMouseHover(); };
    newHour.rect.onMouseOut = function () { newHour.onMouseOut(); };
    newHour.rect.onMouseClick = function () { newHour.onMouseClick(); };
    newHour.add(newHour.rect);
    newHour.text = new THREE.Mesh(config.HOURS.GEOMETRY[currentHour], textMaterial);
    newHour.text.position.x = -cellSize / 2;
    newHour.text.position.y = -cellSize / 2 + (config.HOURS.NUMBER_OF - currentHour) * fontSize * 1.1 + padding - fontSize / 2;
    newHour.text.defaultMaterial = textMaterial;
    newHour.text.onMouseHover = function () { newHour.onMouseHover(); };
    newHour.text.onMouseOut = function () { newHour.onMouseOut(); };
    newHour.text.onMouseClick = function () { newHour.onMouseClick(); };
    newHour.add(newHour.text);
    newHour.onMouseHover = function () {
        if (!newHour.selected) {
            newHour.rect.material = newHour.rect.material.clone();
            newHour.rect.material.color = new THREE.Color(0x00ff00);
        }
    };
    newHour.onMouseOut = function () {
        // newHour.rect.material = newHour.rect.defaultMaterial;
    };
    newHour.onMouseClick = function () {
        newHour.selected = !newHour.selected;
        console.log("Hour clicked:");
        console.log(newHour.date);
        console.log("############################");
        if (newHour.selected) {
            newHour.rect.material = newHour.rect.material.clone();
            newHour.rect.material.color = new THREE.Color(0x0000ff);
        }
        else {
            newHour.rect.material = newHour.rect.defaultMaterial;
        }
    };
    config.HOURS.INSTANCES[date] = newHour;
    return newHour;
}
var Day = (function () {
    function Day(date) {
        this.margin = 0.1;
        this.cellSize = 30;
        this.x = date.day() * this.cellSize + date.day() * this.margin;
        this.weekOfMonth = date.week();
        this.y = -this.weekOfMonth * this.cellSize + -this.weekOfMonth * this.margin;
    }
    return Day;
}());
function my() {
    var rectMesh = new THREE.Mesh(rectGeom, rectMaterial);
    rectMesh.position.x = x;
    rectMesh.position.y = y;
    rectMesh.defaultMaterial = rectMaterial;
    rectMesh.name = "day";
    rectMesh.onMouseHover = function () {
        // rectMesh.material = rectMesh.material.clone();
        // rectMesh.material.color = new THREE.Color( 0xff0000 );
    };
    rectMesh.onMouseOut = function () {
        // rectMesh.material = rectMesh.defaultMaterial;
    };
    rectMesh.onMouseClick = function () { };
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
    rectMesh.add(textMesh);
    for (var i = date.clone().startOf("day"); +i < +date.clone().endOf("day"); i.add(1, "hours")) {
        // console.log("Creating hour:");
        // console.log(i.toDate());
        // console.log(i.format("HH:mm") + " = " + date.clone().endOf("day").format("HH:mm"));
        // startDate.add(1, "hours");
        // startDate;
        // console.log(startDate);
        // console.log(startDate.isBefore(date.endOf("day")));
        rectMesh.add(hour(i));
    }
    return rectMesh;
}
my.cellSize = function (value) {
    if (!arguments.length)
        return cellSize;
    cellSize = value;
    return my;
};
my.margin = function (value) {
    if (!arguments.length)
        return margin;
    margin = value;
    return my;
};
my.create = function () {
    return my();
};
return my;
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
