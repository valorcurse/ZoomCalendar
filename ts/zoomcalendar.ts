///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/d3/d3.d.ts"/>
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
/// <reference path="config.ts"/>
/// <reference path="day.ts"/>

import Moment = moment.Moment;

namespace Mouse {
	export var position: THREE.Vector2;

    export module onMouseDown {
        export var startPosition: Point;
        export var endPosition: Point;
    }
}

interface DateSelection {
	start?: Hour,
	end?: Hour
}

class ZoomCalendar extends THREE.WebGLRenderer {

	scene: THREE.Scene;
	camera: THREE.OrthographicCamera;

	year: number = 2016;
	month: number = 1;

	dates: Date[];
	view: any;

	constructor() {
		super({ antialias: true });

		
		var DZOOM = 5;

		this.scene = new THREE.Scene();
		this.scene.updateMatrixWorld(true);

		var sceneSize = { "width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97 };
		var aspect = sceneSize.width / sceneSize.height;
		this.camera = new THREE.OrthographicCamera(0, 2 * DZOOM * aspect, 0, -2 * DZOOM, -1000, 1000);
		this.camera.updateProjectionMatrix();

		this.setSize(sceneSize.width, sceneSize.height);
		this.setClearColor(0xcccccc, 1);
		this.draw();

		document.addEventListener('mousemove', onMouseMove, false);
		var raycaster = new THREE.Raycaster();
		var intersects: THREE.Intersection[] = [];
		var oldIntersects: Hour[] = [];

		var selection: DateSelection = { start: null, end: null };
		function onMouseMove(event: MouseEvent) {
			event.preventDefault();

			Mouse.position.x = (event.clientX / window.innerWidth) * 2 - 1;
			Mouse.position.y = - (event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(Mouse.position, this.camera);
			intersects = raycaster.intersectObjects(this.scene.children, true);

			// Unhover hours which are no longer being hovered
			for (var index = 0; index < oldIntersects.length; index++) {
				var oldIntersect = oldIntersects[index];

				if (oldIntersect.date.isAfter(selection.end.date)) {
					var hour: Hour = oldIntersect as Hour;
					hour.onMouseOut();
					oldIntersects.splice(index, 1);
				}
			}

			if (!selection.start)
				return;

			// Select last hour for selection
			for (var i = 0; i < intersects.length; i++) {
				var intersect = intersects[i];

				if (intersect.object.parent instanceof Hour) {
					var hour: Hour = intersect.object.parent as Hour;
					selection.end = hour;
				}
			}

			// Hover over all hour between start and end
			for (var d = selection.start.date.clone(); d.isSameOrBefore(selection.end.date); d.add(1, "hour")) {
				var selectedHour = Config.HOURS.INSTANCES[+d];
				selectedHour.onMouseHover();

				if (oldIntersects.indexOf(selectedHour) < 0) {
					oldIntersects.push(selectedHour);
				}
			}
		}

		document.addEventListener('click', onClick, false);
		function onClick(event: MouseEvent) {
			if (intersects.length <= 0)
				return;

			var mouseDeltaMovement =
				Mouse.onMouseDown.startPosition.x - event.clientX +
				Mouse.onMouseDown.startPosition.y - event.clientY;

			// Ignore click if mouse moved
			if (mouseDeltaMovement !== 0)
				return;

			var intersect = intersects[0];
			var objectsParent = intersect.object.parent;
			if (objectsParent instanceof Hour) {
				var hour: Hour = objectsParent as Hour;
				selection.start = hour;
				hour.onMouseClick();
			}
		}

		document.addEventListener('mousedown', onMouseDown, false);
		function onMouseDown(event: MouseEvent) {
			console.log("Mouse is down.");
			Mouse.onMouseDown.startPosition = { x: event.clientX, y: event.clientY };
		}

		// this.setSize(sceneSize.width, sceneSize.height);
		// this.setClearColor(0xcccccc, 1);
		// this.draw();

		// var year = 2016,
			// month = 1,
		var currentDate = new Date(this.year, this.month);

		// var dates = d3.time.days(moment(currentDate).startOf("month"), moment(currentDate).add(1, "month").endOf("month"))
		this.dates = d3.time.days(moment(currentDate).startOf("year").toDate(), moment(currentDate).endOf("month").toDate())
		console.log(days);
		// var dates = d3.time.days(moment(currentDate).startOf("year"), moment(currentDate).endOf("year"))



		this.view = d3.select(this.domElement);
		var zoom = d3.behavior.zoom()
			.scaleExtent([0.06, 0.45])
			.scale(0.06)
			.translate([-975, 100])
			;

		var loader = new THREE.FontLoader();
		loader.load('fonts/helvetiker_regular.typeface.js', function(f: THREE.Font) {
			font = f;
			this.generateTextGeometry();
			this.createComponents();

			this.draw();
			zoomed();
		});


		function translate(x: number, y: number, z: number) {
			x = x - sceneSize.width / 2;
			y = y - sceneSize.height / 2;
			this.camera.left = -DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
			this.camera.right = DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
			this.camera.top = DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
			this.camera.bottom = -DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
			this.camera.updateProjectionMatrix();
		}

		var zoomed = function() {
			var x = zoom.translate()[0],
				y = zoom.translate()[1],
				z = zoom.scale();

			translate(x, y, z);
		};

		zoom.on('zoom', zoomed);
		this.view.call(zoom)
			.on("dblclick.zoom", null) // disable zoom in on double-click
			;
	}

	draw() {
		requestAnimationFrame(this.draw);
		this.render(this.scene, this.camera);
	}

	createComponents() {
		for (var i = 0; i < this.dates.length; i++) {
			var date = moment(this.dates[i]);
			var newDay = new Day(date);
			this.scene.add(newDay);

			// var bbox = new THREE.BoundingBoxHelper(newDay, 0x0000ff);
			// bbox.update();
			// this.scene.add(bbox);

		}

		var cameraBB = new THREE.Box3();
		cameraBB.setFromObject(this.scene);
		this.camera.position.set(-cameraBB.max.x, cameraBB.max.y * 2, 0); // TODO: Find out the correct values

		this.camera.updateProjectionMatrix();
	};

	generateTextGeometry() {
	    for (var h = 0; h < Config.HOURS.NUMBER_OF; h++) {
	        var hourGeom = new THREE.TextGeometry(h, {
	            font: font,
	            size: fontSize,
	            dynamic: false
	        });

	        Config.HOURS.GEOMETRY.push(hourGeom)
	    }

	    for (var d = 1; d <= Config.DAYS.NUMBER_OF; d++) {
	        var dayGeom = new THREE.TextGeometry(d, {
	            font: font,
	            size: dateSize,
	            dynamic: false
	        });

	        Config.DAYS.GEOMETRY.push(dayGeom)
	    }

	    for (var m = 0; m < this.dates.length; m++) {
	        var date = moment(this.dates[m]);
	        var monthGeom = new THREE.TextGeometry(date.format("MMM"), {
	            font: font,
	            size: dateSize,
	            dynamic: false
	        });

	        Config.MONTHS.GEOMETRY.push(monthGeom);
	    }
	}
}