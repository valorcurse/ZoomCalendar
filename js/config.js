const config = {
    "DAYS": {
        "NUMBER_OF" :7,
        "SPACE_BETWEEN": 5
    },
    "WEEKS": {
         "AXIS": {
             "HEIGHT": 40,
             "Y_PADDING": 30
         }
    }
    
};

const ZoomLevel = {
    YEAR: 0.5,
    MONTH: 1,
    DAY: 3,
};

var zoomLevel = ZoomLevel.YEAR;
var previousZoomLevel = ZoomLevel.YEAR;


const rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cellSize = 20;
const rectGeom = new THREE.BoxGeometry(cellSize, cellSize, 0);

const textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000,
    overdraw: true,
    shading: THREE.FlatShading
});

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xdddddd
});

const linePadding = 0.5;
const lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(
    new THREE.Vector3(linePadding, 0, 0),
    new THREE.Vector3(cellSize - linePadding, 0, 0)
);

const hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });