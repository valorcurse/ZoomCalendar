const config = {
    "HOURS": {
        "NUMBER_OF": 24,
        "GEOMETRY": [],
        "INSTANCES": {}
    },
    "DAYS": {
        "NUMBER_OF": 31,
        "GEOMETRY": []
    },
    "MONTHS": {
        "NUMBER_OF": 12,
        "GEOMETRY": []
    }
    
};

var font;

const cellSize = 30;
const dateSize = cellSize / 16;
const padding = 0.5;
const hoursArea = cellSize - padding*2 - dateSize*3;
const fontSize = hoursArea / 24;

const rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const rectGeom = new THREE.BoxGeometry(cellSize, cellSize, 0);

const textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000,
    overdraw: true,
    shading: THREE.FlatShading
});

var generateTextGeometry = function() {
    for (var h = 1; h <= config.HOURS.NUMBER_OF; h++) {
        var hourGeom = new THREE.TextGeometry(h, {
            font: font,
            size: fontSize,
            dynamic: false
        });
        
        config.HOURS.GEOMETRY.push(hourGeom)
    }
    
    for (var d = 1; d <= config.DAYS.NUMBER_OF; d++) {
        var dayGeom = new THREE.TextGeometry(d, {
            font: font,
            size: dateSize,
            dynamic: false
        });
        
        config.DAYS.GEOMETRY.push(dayGeom)
    }
    
    var dates = d3.time.months(moment(currentDate).startOf("year"), moment(currentDate).endOf("year"));
    // console.log(dates);
    for (var m = 0; m < dates.length; m++) {
        var date = moment(dates[m]);
        var monthGeom = new THREE.TextGeometry(date.format("MMM"), {
            font: font,
            size: dateSize,
            dynamic: false
        });
        
        config.MONTHS.GEOMETRY.push(monthGeom);
    }
}

const hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
const hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);

var days = [];

var shiftPressed = false;