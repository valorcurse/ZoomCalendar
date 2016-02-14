// var calendar = freetimeCalendar()
//     .margin(10)
// ;

// d3.select("body")
//     .call(calendar)
// ;

var view;
var  DZOOM = 10;

var scene = new THREE.Scene();
scene.updateMatrixWorld(true);

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

function makeTextSprite(message, parameters) {
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.canvas.width = 256;
    context.canvas.height = 128;
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    // roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;  
}


// scene.add(makeTextSprite("lalala"));

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

	var rectGeom = new THREE.ShapeGeometry(rectShape);
	var rectMesh = new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
	scene.add(rectMesh);
	
	var text = makeTextSprite(date.format("DD MMM"));
	text.position.set(x + cellSize + margin, y + margin, 0);
	scene.add(text);
}


view = d3.select(renderer.domElement);
zoom = d3.behavior.zoom()
    .scaleExtent([0.2, 4])
    .scale(0.2)
;


var bb = new THREE.Box3()
bb.setFromObject(scene);
console.log(bb.max);
camera.position.set(-bb.max.x, bb.max.y * 2, 0); // TODO: Find out the correct values

camera.updateProjectionMatrix();
console.log(zoom.translate());

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