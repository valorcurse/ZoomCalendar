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

var view: any;
var DZOOM = 5;
// var font;

var scene = new THREE.Scene();
scene.updateMatrixWorld(true);

var sceneSize = {"width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97};
var aspect = sceneSize.width / sceneSize.height;
// var camera = new THREE.OrthographicCamera(0, 2 * DZOOM * aspect, 0, -2 * DZOOM, -1000, 1000);
var camera = new THREE.OrthographicCamera(0, sceneSize.width, 0, sceneSize.width, -1000, 1000);
camera.updateProjectionMatrix();
// camera.position.set(-50, 50, 0);
// camera.position.set(scene.position);

document.addEventListener('mousemove', onMouseMove, false );
var raycaster = new THREE.Raycaster();
var intersects: THREE.Intersection[] = [];
var intersected: THREE.Intersection[] = [];
interface DateSelection {
    start?: Date,
    end?: Date
}
var selection: DateSelection = { start: null, end: null };
function onMouseMove(event: MouseEvent) {
    console.log(event);
    event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

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
	console.log(intersects[0].object.parent.date)
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
        return
        
    var intersect = intersects[0].object;
    intersect.onMouseClick();
    // console.log(intersect.parent.date);
    if (intersect.parent.date) {
        // console.log(intersect.parent.date);
        if (!selection.start) {
            console.log("Setting start date:")
            console.log(intersect.parent.date.toDate());
            console.log("#############################")
            selection.start = intersect.parent.date;
        } else {
            console.log("Setting end date: " + intersect.parent.date)
            selection.end = intersect.parent.date;
        }
    }
}

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sceneSize.width, sceneSize.height);
renderer.setClearColor(0xcccccc, 1);
document.body.appendChild(renderer.domElement);

var render = function() {
	return renderer.render(scene, camera);
}

var year = 2016,
	month = 1,
	currentDate = new Date(year, month);

// var dates = d3.time.days(moment(currentDate).startOf("month"), moment(currentDate).add(1, "month").endOf("month"))
var dates = d3.time.days(moment(currentDate).startOf("year"), moment(currentDate).endOf("month"))
// var dates = d3.time.days(moment(currentDate).startOf("year"), moment(currentDate).endOf("year"))

var draw = function() {
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
    .scale(0.115)
;

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
var zoomed = function() {
    var x = zoom.translate()[0],
        y = zoom.translate()[1],
        z = zoom.scale();

    return requestAnimationFrame(function() {
        translate(x, y, z);
        return render();
    });
}

zoom.on('zoom', zoomed);
view.call(zoom)
    .on("dblclick.zoom", null) // disable zoom in on double-click
;