///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/d3/d3.d.ts"/>
///<reference path="../typings/main/ambient/moment-node/moment-node.d.ts"/>
/// <reference path="config.ts"/>
/// <reference path="day.ts"/>

import Moment = moment.Moment;

namespace Mouse {
	export var position: THREE.Vector2 = new THREE.Vector2();

    export module click {
        export var position: Point;
        export var selection: DateSelection = { start: null, end: null };
    }

    export module hover {
		export var raycaster: THREE.Raycaster = new THREE.Raycaster();
    	export var intersects: THREE.Intersection[] = [];
		export var oldIntersects: Hour[] = [];
    }
}

interface DateSelection {
	start?: Hour,
	end?: Hour
}

class ZoomCalendar extends THREE.WebGLRenderer {

	scene: THREE.Scene = new THREE.Scene();
	sceneSize = { "width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97 };
	aspect: number = this.sceneSize.width / this.sceneSize.height;
	
	camera: THREE.OrthographicCamera;

	year: number = 2016;
	month: number = 1;

	dates: Date[];
	view: any;

	font: THREE.Font;

	DZOOM: number = 5;
	zoom = d3.behavior.zoom()
		.scaleExtent([0.06, 0.45])
		.scale(0.06)
		.translate([-975, 100])
	;


	constructor() {
		super({ antialias: true });

		console.log(Mouse);

		

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

		this.dates = d3.time.days(
			moment(currentDate).startOf("year").toDate(),
			moment(currentDate).endOf("month").toDate());

		this.view = d3.select(this.domElement);

		var loader = new THREE.FontLoader();
		loader.load('fonts/helvetiker_regular.typeface.js', function(f: THREE.Font) {
			this.font = f;
			this.init();
		});

		this.zoom.on('zoom', this.zoomed);
		this.view.call(this.zoom)
			.on("dblclick.zoom", null) // disable zoom in on double-click
		;
	}

	init() {
		this.generateTextGeometry();
		this.createComponents();

		this.draw();
		this.zoomed();
	}

	zoomed() {
		var x = this.zoom.translate()[0],
			y = this.zoom.translate()[1],
			z = this.zoom.scale();

		this.translate(x, y, z);
	};


	translate(x: number, y: number, z: number) {
		x = x - this.sceneSize.width / 2;
		y = y - this.sceneSize.height / 2;
		this.camera.left = -this.DZOOM / z * this.aspect - x / this.sceneSize.width * this.DZOOM / z * 2 * this.aspect;
		this.camera.right = this.DZOOM / z * this.aspect - x / this.sceneSize.width * this.DZOOM / z * 2 * this.aspect;
		this.camera.top = this.DZOOM / z + y / this.sceneSize.height * this.DZOOM / z * 2;
		this.camera.bottom = -this.DZOOM / z + y / this.sceneSize.height * this.DZOOM / z * 2;
		this.camera.updateProjectionMatrix();
	}

	onClick(event: MouseEvent) {
		if (Mouse.hover.intersects.length <= 0)
			return;

		var mouseDeltaMovement =
			Mouse.click.position.x - event.clientX +
			Mouse.click.position.y - event.clientY;

		// Ignore click if mouse moved
		if (mouseDeltaMovement !== 0)
			return;

		var intersect = Mouse.hover.intersects[0];
		var objectsParent = intersect.object.parent;
		if (objectsParent instanceof Hour) {
			var hour: Hour = objectsParent as Hour;
			Mouse.click.selection.start = hour;
			hour.onMouseClick();
		}
	}

	onMouseMove(event: MouseEvent) {
		event.preventDefault();

		Mouse.position.x = (event.clientX / window.innerWidth) * 2 - 1;
		Mouse.position.y = - (event.clientY / window.innerHeight) * 2 + 1;

		Mouse.hover.raycaster.setFromCamera(Mouse.position, this.camera);
		Mouse.hover.intersects = Mouse.hover.raycaster.intersectObjects(this.scene.children, true);

		// Unhover hours which are no longer being hovered
		for (var index = 0; index < Mouse.hover.oldIntersects.length; index++) {
			var oldIntersect = Mouse.hover.oldIntersects[index];

			if (oldIntersect.date.isAfter(Mouse.click.selection.end.date)) {
				var hour: Hour = oldIntersect as Hour;
				hour.onMouseOut();
				Mouse.hover.oldIntersects.splice(index, 1);
			}
		}

		if (!Mouse.click.selection.start)
			return;

		// Select last hour for selection
		for (var i = 0; i < Mouse.hover.intersects.length; i++) {
			var intersect = Mouse.hover.intersects[i];

			if (intersect.object.parent instanceof Hour) {
				var hour: Hour = intersect.object.parent as Hour;
				Mouse.click.selection.end = hour;
			}
		}

		// Hover over all hour between start and end
		for (var d = Mouse.click.selection.start.date.clone(); d.isSameOrBefore(Mouse.click.selection.end.date); d.add(1, "hour")) {
			var selectedHour = Config.HOURS.INSTANCES[+d];
			selectedHour.onMouseHover();

			if (Mouse.hover.oldIntersects.indexOf(selectedHour) < 0) {
				Mouse.hover.oldIntersects.push(selectedHour);
			}
		}
	}

	onMouseDown(event: MouseEvent) {
		console.log("Mouse is down.");
		Mouse.click.position = { x: event.clientX, y: event.clientY };
	}

	draw() {
		requestAnimationFrame(this.renderCallback);
		this.renderCallback();
	}

	renderCallback() {
		return this.render(this.scene, this.camera)
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
	            font: this.font,
	            size: fontSize,
	            dynamic: false
	        });

	        Config.HOURS.GEOMETRY.push(hourGeom)
	    }

	    for (var d = 1; d <= Config.DAYS.NUMBER_OF; d++) {
	        var dayGeom = new THREE.TextGeometry(d, {
	            font: this.font,
	            size: dateSize,
	            dynamic: false
	        });

	        Config.DAYS.GEOMETRY.push(dayGeom)
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
	}
}