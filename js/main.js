// var calendar = freetimeCalendar()
//     .margin(10)
// ;

// d3.select("body")
//     .call(calendar)
// ;


var stats = new Stats();
stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

var view;
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


// console.log(camera);

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
    // var cellSize = sceneSize.width / 7 - 5 * 7;
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
zoom = d3.behavior.zoom()
    .scaleExtent([0.115, 0.45])
    .scale(0.115)
;

var aspectRatio = sceneSize.width / sceneSize.height;
var zoomed = function() {
    var x, y, z, _ref;
    z = zoom.scale();
    console.log(z);
    _ref = zoom.translate(), x = _ref[0], y = _ref[1];
    return requestAnimationFrame(function() {
        // stats.begin();
        stats.update();    
        x = x - sceneSize.width / 2;
        y = y - sceneSize.height / 2;
        camera.left = -DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
        camera.right = DZOOM / z * aspect - x / sceneSize.width * DZOOM / z * 2 * aspect;
        camera.top = DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
        camera.bottom = -DZOOM / z + y / sceneSize.height * DZOOM / z * 2;
        camera.updateProjectionMatrix();
        // stats.end();
        return render();
    });
}

zoom.on('zoom', zoomed);
view.call(zoom);