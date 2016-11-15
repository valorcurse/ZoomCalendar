import * as d3Zoom from 'd3-zoom';
import * as d3Time from 'd3-time';
import * as d3Selection from 'd3-selection';

import * as moment from 'moment';
type Moment = moment.Moment;

import {WebGLRenderer,
		Scene,
		OrthographicCamera,
		Font,
		Texture,
		LoadingManager,
		Vector2,
		Box3,
		FontLoader,
		TextGeometry,
		WebGLRenderTarget,
		LinearMipMapLinearFilter,
		NearestMipMapLinearFilter,
		PlaneBufferGeometry,
		MeshBasicMaterial,
		Mesh,
		Raycaster,
		Intersection
} from 'three';

import {Event} from "./day/event/event.model";
// import {Day, DailyHours, Hour} from "./day";
import {Day} from "./day/day";
import {DayView} from "./day/day.view";
import {Hour, DailyHours} from "./day/day.view";
// import * as Globals from "./globals";
import {
    RTT, 
    MONTHS,
    DAYS,
    HOURS,
    Materials,
    Components,
    Sizes,
    Point
} from './globals';
 
interface DateSelection {
	start?: Hour,
	end?: Hour
}
 
export class ZoomCalendar extends WebGLRenderer {

	scene: Scene = new Scene();
	sceneSize = { "width": window.innerWidth, "height": window.innerHeight};
	aspect: number = this.sceneSize.width / this.sceneSize.height;
	
	camera: OrthographicCamera;
	raycaster: Raycaster;

	year: number = 2016;
	month: number = 1;

	dates: Map<number, Day> = new Map<number, Day>();

	view: any;
	context: any;

	font: Font;

	DZOOM: number = 5;

	zoom: any = d3Zoom.zoom();

	lastTranslation: any;

	dailyTexture: Texture;

	public constructor() {
		super({ antialias: true });
		
		this.scene.updateMatrixWorld(true);
		
		this.camera = new OrthographicCamera( 
            window.innerWidth / -2, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            window.innerHeight / -2, 
            -1000, 1000 );
		this.camera.updateProjectionMatrix();
		
		this.raycaster = new Raycaster();

		this.setSize(this.sceneSize.width, this.sceneSize.height);
		this.setClearColor(0xcccccc, 1);

		document.addEventListener('mousemove', this.onMouseMove, false);
		document.addEventListener('click', this.onClick, false);
		document.addEventListener('mousedown', this.onMouseDown, false);
		document.addEventListener('mouseup', this.onMouseUp, false);
		document.addEventListener('ondrag', this.onDrag, false);

		var currentDate = new Date(this.year, this.month);

		d3Time.timeDays(
			moment(currentDate).startOf("year").toDate(),
			moment(currentDate).endOf("month").toDate()
		).forEach((date) => {	
			this.dates.set(date.getTime(), null);
		});
		
		this.view = d3Selection.select(this.domElement);

		this.zoom(this.view);

		var loader = new FontLoader(new LoadingManager());
		loader.load('fonts/helvetiker_regular.typeface.json', (responseText: string) => {
			
			// Have to do this retardedness to prevent an error message from popping up
			var fontObject = JSON.parse(JSON.stringify(responseText));
			this.font = new Font(fontObject.data);
			this.init();
		});
		
		var t = d3Zoom.zoomIdentity.translate(0, 0).scale(0.03);
		this.zoom.transform(this.view, t);
		this.translate(t.x, t.y, t.k);
	}
    
	init() {
		this.generateTextGeometry();
		this.generateDayTexture();
		this.createComponents();

		this.draw();

	    this.zoom
	    	.on('zoom', this.zoomed)
	    	.filter(function() {
	    		// Allow for zoom/pan with left/middle mouse button or mouse wheel
				return ((d3Selection.event.button === 0 && d3Selection.event.ctrlKey)
					|| d3Selection.event.button === 1 
					|| d3Selection.event instanceof WheelEvent
					|| d3Selection.event instanceof TouchEvent);
			});
			
		this.view.call(this.zoom)
			.on("dblclick.zoom", null) // disable zoom in on double-click
		;
		
		var start = new Date("January 13, 2016 11:13:00");
		var end = new Date("January 13, 2016 17:47:00");

		this.addEvent(start, end);
	}

	zoomed = () => {
		if (d3Selection.event != null) {
			var transform: any = d3Selection.event.transform;
			var x = transform.x,
				y = transform.y,
				z = transform.k;
				
			this.translate(x, y, z);
		}
	};


	translate = (x: number, y: number, z: number) => {
		x -= this.sceneSize.width / 2;
		y -= this.sceneSize.height / 2;
		this.camera.left = -this.DZOOM / z * this.aspect - x / this.sceneSize.width * this.DZOOM / z * 2 * this.aspect;
		this.camera.right = this.DZOOM / z * this.aspect - x / this.sceneSize.width * this.DZOOM / z * 2 * this.aspect;
		this.camera.top = this.DZOOM / z + y / this.sceneSize.height * this.DZOOM / z * 2;
		this.camera.bottom = -this.DZOOM / z + y / this.sceneSize.height * this.DZOOM / z * 2;
		this.camera.updateProjectionMatrix();
	}

	intersectedObjects(event: MouseEvent): any[] {
		var position: Vector2 = new Vector2();
		position.x = (event.clientX / window.innerWidth) * 2 - 1;
		position.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this.raycaster.setFromCamera(position, this.camera);
		
		var intersects: any[] = this.raycaster.intersectObjects(this.scene.children, true);
		return intersects.filter(
			intersect =>
				intersect.object.intersectable
		);
	}

	onClick(event: MouseEvent) {
		if (Mouse.hover.intersects.length <= 0 || !Mouse.click.position)
			return;
	}

	onMouseMove = (event: MouseEvent) => {
		event.preventDefault();
		
		for (let intersect of this.intersectedObjects(event)) {
			if (intersect.object.mouseMove)
				intersect.object.mouseMove(intersect.uv);
		}
	}

	onMouseDown = (event: MouseEvent) => {
		Mouse.click.position = { x: event.clientX, y: event.clientY };
		
		var intersects = this.intersectedObjects(event);
		for (let intersect of intersects) {
			if (intersect.object.mouseDown)
				intersect.object.mouseDown(intersect.uv);
		}
	}
	
	onMouseUp = (event: MouseEvent) => {
		// Mouse.click.position = { x: event.clientX, y: event.clientY };
		
		var intersects = this.intersectedObjects(event);
		for (let intersect of intersects) {
			if (intersect.object.mouseUp)
				intersect.object.mouseUp(intersect.uv);
		}
	}
	
	onDrag(event: MouseEvent) {
		// Mouse.click.position = { x: event.clientX, y: event.clientY };
		
		// for (let intersect of this.intersectedObjects(event)) {
			// if (intersect.object.mousedown)
				// intersect.object.mouseover(intersect.uv);
		// }
		
		console.log("Dragging mouse!")
		console.log(event);
	}

	draw = () => {
		requestAnimationFrame(this.draw);
		this.render(this.scene, this.camera);
	}

	createComponents() {
		for (let date of this.dates.keys()) {
			var newDay: Day = new Day(moment(date));
			this.scene.add(newDay.view());
			this.dates.set(date, newDay);

			// var bbox = new BoundingBoxHelper(newDay, 0x0000ff);
			// bbox.update();
			// this.scene.add(bbox);
		}
		
		console.log(this.dates);

		var cameraBB = new Box3();
		cameraBB.setFromObject(this.scene);
	}

	generateTextGeometry() {
		console.log(this.font);
	    for (var h = 0; h < HOURS.NUMBER_OF; h++) {
	        var hourGeom = new TextGeometry(String(h + ":00"), {
	            font: this.font,
	            size: (window.innerHeight / 24 / 2),
	            height: 50,
	            curveSegments: 4,
	            bevelEnabled: false,
	            bevelThickness: 10,
	            bevelSize: 8
	        });

	        HOURS.GEOMETRY.push(hourGeom)
	    }

	    for (var d = 1; d <= DAYS.NUMBER_OF; d++) {
	        var dayGeom = new TextGeometry(String(d), {
	            font: this.font,
	            size: Sizes.dateSize,
				height: 50,
				curveSegments: 4,
				bevelEnabled: false,
	            bevelThickness: 10,
	            bevelSize: 8
	        });

	        DAYS.GEOMETRY.push(dayGeom)
	    }

	    for (let date of this.dates.keys()) {
	        var monthGeom = new TextGeometry(moment(date).format("MMM"), {
	            font: this.font,
	            size: Sizes.dateSize,
	            height: 50,
	            curveSegments: 4,
	            bevelEnabled: false,
	            bevelThickness: 10,
	            bevelSize: 8
	        });

	        MONTHS.GEOMETRY.push(monthGeom);
	    }
	}
	
	generateDayTexture() {
		var width = window.innerWidth,
			height = window.innerHeight;
		
		var camera = new OrthographicCamera( 
            width / -2, 
            width / 2, 
            height / 2, 
            height / -2, 
            -10000, 10000 );
        
        camera.position.z = 50;
        var bufferScene = new Scene();
        bufferScene.add(new DailyHours());
        
        var bufferTexture = new WebGLRenderTarget( 
        	8192, 
        	8192, 
        	{ minFilter: LinearMipMapLinearFilter  , magFilter: NearestMipMapLinearFilter  } 
        );
        

        this.render(bufferScene, camera, bufferTexture);
        RTT.dayTexture = bufferTexture.texture;
	}
	
	public addEvent(start: Date, end: Date) {
		// var momentStart: Moment = moment(start);
		// var momentEnd: Moment = moment(end);
		
		// if (!momentStart.isSame(momentEnd, 'day'))
		// 	return;
		
		// console.log("Dates are in same day");
		// var event: Event = new Event(momentStart, momentEnd);
		
		// var startOfDay: Moment = momentStart.clone().startOf('day');
		// var eventDay: Day = this.dates.get(+startOfDay);
		// eventDay.addEvent(event);
		
		// console.log(momentStart);
    }
}

namespace Mouse {
	export var position: Vector2 = new Vector2();

    export module click {
        export var position: Point;
        export var selection: DateSelection = { start: null, end: null };
    }
    

    export module hover {
		export var raycaster: Raycaster = new Raycaster();
    	export var intersects: Intersection[] = [];
		export var oldIntersects: Hour[] = [];
    }
}