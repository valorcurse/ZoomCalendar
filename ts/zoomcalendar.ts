import * as d3Zoom from 'd3-zoom';
import * as d3Time from 'd3-time';
import * as d3Selection from 'd3-selection';

// import * as d3 from "./d3;

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

import {Event} from "./event";
import {Day, DailyHours, Hour} from "./day";
import * as Globals from "./globals";
 
interface DateSelection {
	start?: Hour,
	end?: Hour
}
 
export class ZoomCalendar extends WebGLRenderer {

	scene: Scene = new Scene();
	sceneSize = { "width": window.innerWidth, "height": window.innerHeight};
	aspect: number = this.sceneSize.width / this.sceneSize.height;
	
	camera: OrthographicCamera;

	year: number = 2016;
	month: number = 1;

	// dates: Date[];
	dates: Map<number, Day> = new Map<number, Day>();
	// dates: {date: Date, mesh: Day};
	// dates: {};
	view: any;
	context: any;

	font: Font;

	DZOOM: number = 5;

	zoom: any = d3Zoom.zoom();

	lastTranslation: any;

	dailyTexture: Texture;

	public constructor() {
		super({ antialias: true });

		// this.scene = new Scene();
		this.scene.updateMatrixWorld(true);

		// var aspect = this.sceneSize.width / this.sceneSize.height;
		// this.camera = new OrthographicCamera(0, 2 * this.DZOOM * this.aspect, 0, -2 * this.DZOOM, -1000, 1000);
			this.camera = new OrthographicCamera( 
            window.innerWidth / -2, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            window.innerHeight / -2, 
            -1000, 1000 );
		this.camera.updateProjectionMatrix();

		this.setSize(this.sceneSize.width, this.sceneSize.height);
		this.setClearColor(0xcccccc, 1);
		// this.draw();


		document.addEventListener('mousemove', this.onMouseMove, false);
		document.addEventListener('click', this.onClick, false);
		document.addEventListener('mousedown', this.onMouseDown, false);

		var currentDate = new Date(this.year, this.month);

		d3Time.timeDays(
			moment(currentDate).startOf("year").toDate(),
			moment(currentDate).endOf("month").toDate()
		).forEach((date) => {	
			this.dates.set(date.getTime(), null);
		});
		
		console.log(this.dates);
		// 	array.forEach(function(data){
	 //   		obj[data[0]] = data[1]
		// });
		
		// var result = arr.reduce(function(map, obj) {
		//     map[obj.key] = obj.val;
		//     return map;
		// }, {});



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
	    		console.log(d3Selection.event);
	    		// Allow for zoom/pan with left/middle mouse button or mouse wheel
				return ((d3Selection.event.button === 0 && d3Selection.event.ctrlKey)
					|| d3Selection.event.button === 1 
					|| d3Selection.event instanceof WheelEvent
					|| d3Selection.event instanceof TouchEvent);
			});
			
		this.view.call(this.zoom)
			.on("dblclick.zoom", null) // disable zoom in on double-click
		;
		
		// this.zoomed();
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

	getHoveredDay(event: MouseEvent) {
		for (var i = 0; i < Mouse.hover.intersects.length; i++) {
			var intersect: any = Mouse.hover.intersects[i];
			
			
			if (intersect.object.parent instanceof Day &&
				intersect.object.name === "eventArea") 
			{
				var day: Day = intersect.object.parent as Day;
				// console.log(intersect);
				var uv: Vector2 = intersect.uv;
				day.mouseover(uv);
			}
		}
	}

	onClick(event: MouseEvent) {
		if (Mouse.hover.intersects.length <= 0 || !Mouse.click.position)
			return;
	}

	onMouseMove = (event: MouseEvent) => {
		event.preventDefault();

		Mouse.position.x = (event.clientX / window.innerWidth) * 2 - 1;
		Mouse.position.y = - (event.clientY / window.innerHeight) * 2 + 1;

		Mouse.hover.raycaster.setFromCamera(Mouse.position, this.camera);
		Mouse.hover.intersects = Mouse.hover.raycaster.intersectObjects(this.scene.children, true);
		
		this.getHoveredDay(event);
		// var uv: Vector2 = intersect.uv;
		// day.mouseover(uv);
	}

	onMouseDown(event: MouseEvent) {
		console.log("Mouse is down.");
		Mouse.click.position = { x: event.clientX, y: event.clientY };
	}

	draw = () => {
		requestAnimationFrame(this.draw);
		this.render(this.scene, this.camera);
	}

	createComponents() {
		for (let date of this.dates.keys()) {
			var newDay = new Day(moment(date), this.dailyTexture);
			this.scene.add(newDay);
			this.dates.set(date, newDay);

			// var bbox = new BoundingBoxHelper(newDay, 0x0000ff);
			// bbox.update();
			// this.scene.add(bbox);
		}

		var cameraBB = new Box3();
		cameraBB.setFromObject(this.scene);
	}

	generateTextGeometry() {
		console.log(this.font);
	    for (var h = 0; h < Globals.HOURS.NUMBER_OF; h++) {
	        var hourGeom = new TextGeometry(String(h + ":00"), {
	            font: this.font,
	            size: (window.innerHeight / 24 / 2),
	            height: 50,
	            curveSegments: 4,
	            bevelEnabled: false,
	            bevelThickness: 10,
	            bevelSize: 8
	            // dynamic: false
	        });

	        Globals.HOURS.GEOMETRY.push(hourGeom)
	    }

	    for (var d = 1; d <= Globals.DAYS.NUMBER_OF; d++) {
	        var dayGeom = new TextGeometry(String(d), {
	            font: this.font,
	            size: Globals.dateSize,
				height: 50,
				curveSegments: 4,
				bevelEnabled: false,
	            bevelThickness: 10,
	            bevelSize: 8
	            // dynamic: false
	        });

	        Globals.DAYS.GEOMETRY.push(dayGeom)
	    }

	    for (let date of this.dates.keys()) {
	        var monthGeom = new TextGeometry(moment(date).format("MMM"), {
	            font: this.font,
	            size: Globals.dateSize,
	            height: 50,
	            curveSegments: 4,
	            bevelEnabled: false,
	            bevelThickness: 10,
	            bevelSize: 8
	            // ,
	            // dynamic: false
	        });

	        Globals.MONTHS.GEOMETRY.push(monthGeom);
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
        this.dailyTexture = bufferTexture.texture;

	}
	
	public addEvent(start: Date, end: Date) {
		var momentStart: Moment = moment(start);
		var momentEnd: Moment = moment(end);
		
		if (!momentStart.isSame(momentEnd, 'day'))
			return;
		
		console.log("Dates are in same day");
		var event: Event = new Event(momentStart, momentEnd);
		
		
		// var eventDay = Day = this.dates()
		console.log(this.dates);
		// console.log(momentStart.startOf('day').toDate());
		var time: number = +momentStart.startOf('day');
		console.log(time);
		console.log(this.dates.has(time));
    }
}

namespace Mouse {
	export var position: Vector2 = new Vector2();

    export module click {
        export var position: Globals.Point;
        export var selection: DateSelection = { start: null, end: null };
    }
    

    export module hover {
		export var raycaster: Raycaster = new Raycaster();
    	export var intersects: Intersection[] = [];
		export var oldIntersects: Hour[] = [];
    }
}