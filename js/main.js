// var calendar = freetimeCalendar()
//     .margin(10)
// ;

// d3.select("body")
//     .call(calendar)
// ;


var scene = new THREE.Scene();
var sceneSize = {"width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97};
var camera = new THREE.PerspectiveCamera(100, sceneSize.width / sceneSize.height, 1, 100);
camera.position.x = 20;
camera.zoom = 0.5;
camera.updateProjectionMatrix();
var renderer = new THREE.WebGLRenderer();

var cameraControls = new THREE.TrackballControls(camera);
cameraControls.target.set(0, 0, 0);
cameraControls.rotateSpeed = 1.0;
cameraControls.zoomSpeed = 1.2;
cameraControls.panSpeed = 1;

cameraControls.noZoom = false;
cameraControls.noPan = false;
cameraControls.staticMoving = true;

cameraControls.keys = [ 65, 83, 68 ];
// cameraControls.addEventListener( 'change', render );

renderer.setSize(sceneSize.width, sceneSize.height );
document.body.appendChild( renderer.domElement );

var year = 2016,
	month = 1,
	currentDate = new Date(year, month);

var dates = d3.time.days(moment(currentDate).startOf("month"), moment(currentDate).endOf("month"))

// var cellSize = sceneSize.width / 7 - 5 * 7;
var cellSize = 5;
var margin = 1;
for (var i = 0; i <= dates.length; i++) {
	var date = moment(dates[i]);
	var x = date.day() * cellSize + date.day() * margin,
		y = Math.floor(date.date() / 7) * cellSize + Math.floor(date.date() / 7) * margin;

	console.log(x, y);

	var rectShape = new THREE.Shape();
	rectShape.moveTo(x, y);
	rectShape.lineTo(x, y + cellSize);
	rectShape.lineTo(x + cellSize, y + cellSize);
	rectShape.lineTo(x + cellSize, y);
	rectShape.lineTo(x, y);

	var rectGeom = new THREE.ShapeGeometry( rectShape );
	var rectMesh = new THREE.Mesh( rectGeom, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;

	scene.add( rectMesh );
}

camera.position.z = 15;

function render() {
	requestAnimationFrame(render);
	cameraControls.update();
	renderer.render(scene, camera);
}
render();