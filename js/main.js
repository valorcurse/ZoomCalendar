// var calendar = freetimeCalendar()
//     .margin(10)
// ;

// d3.select("body")
//     .call(calendar)
// ;

var view;
var  DZOOM = 10;

var scene = new THREE.Scene();
var sceneSize = {"width": window.innerWidth * 0.98, "height": window.innerHeight * 0.97};
var aspect = sceneSize.width / sceneSize.height;
// var camera = new THREE.OrthographicCamera(0, 2 * DZOOM * aspect, 0, -2 * DZOOM, -1000, 1000);
var camera = new THREE.OrthographicCamera(0, sceneSize.width, 0, sceneSize.width, -1000, 1000);
camera.updateProjectionMatrix();
// camera.position.set(-50, 50, 0);
// camera.position.set(scene.position);


// console.log(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(sceneSize.width, sceneSize.height);
renderer.setClearColor(0xcccccc, 1);
document.body.appendChild(renderer.domElement);

var render = function() {
	return renderer.render(scene, camera);
}

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
    
	var rectShape = new THREE.Shape();
	rectShape.moveTo(x, y);
	rectShape.lineTo(x, y + cellSize);
	rectShape.lineTo(x + cellSize, y + cellSize);
	rectShape.lineTo(x + cellSize, y);
	rectShape.lineTo(x, y);

	var rectGeom = new THREE.ShapeGeometry( rectShape );
	var rectMesh = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));

	scene.add(rectMesh);
}


var bb = new THREE.Box3()
bb.setFromObject(scene);
console.log(bb.max);
// camera.position.set(-bb.max.x, bb.max.y, bb.max.z);
camera.lookAt(scene.position);
console.log(camera.position);
camera.updateProjectionMatrix();

view = d3.select(renderer.domElement);
zoom = d3.behavior.zoom()
    .scaleExtent([0.2, 4])
    .scale(0.2)
;

var aspectRatio = sceneSize.width / sceneSize.height;
var zoomed = function() {
    var x, y, z, _ref;
    z = zoom.scale();
    _ref = zoom.translate(), x = _ref[0], y = _ref[1];
    return requestAnimationFrame(function() {
        x = x - sceneSize.width / 2;
        y = y - sceneSize.height / 2;
        camera.left = -DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
        camera.right = DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
        camera.top = DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
        camera.bottom = -DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
        camera.updateProjectionMatrix();
        return render();
    });
}

zoomed();
zoom.on('zoom', zoomed);
view.call(zoom);
render();