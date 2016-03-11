// const config = {
//     "HOURS": {
//         "NUMBER_OF": 24,
//         "GEOMETRY": [],
//         "INSTANCES": {}
//     },
//     "DAYS": {
//         "NUMBER_OF": 31,
//         "GEOMETRY": []
//     },
//     "MONTHS": {
//         "NUMBER_OF": 12,
//         "GEOMETRY": []
//     }
// };

///<reference path="../typings/main/ambient/three/three.d.ts"/>
///<reference path="../typings/main/ambient/moment/moment.d.ts"/>
declare module THREE { 
    export var FontLoader: any;
    export class Font {
        constructor(font: any);
    }
    export class TextGeometry extends Geometry {
        constructor(font: THREE.Font, parameters?: any);
    }
}

module Config {
    export module HOURS {
        export const NUMBER_OF: number = 24;
        export var  GEOMETRY: THREE.TextGeometry[] = [];
        export var INSTANCES: { [date: number]: Hour; } = { };
    }
    
    export module DAYS {
        export const NUMBER_OF: number = 31;
        export var GEOMETRY: THREE.TextGeometry[] = [];
    }
    
    export module MONTHS {
        export const NUMBER_OF: number = 12;
        export var GEOMETRY: THREE.TextGeometry[] = [];
    }
}

var font: THREE.Font;

const cellSize = 30;
const dateSize = cellSize / 16;
const padding = 0.5;
const hoursArea = cellSize - padding*2 - dateSize*3;
const fontSize = hoursArea / 24;

const rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const rectGeom = new THREE.BoxGeometry(cellSize, cellSize, 0);

const textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000,
    shading: THREE.FlatShading
});

var generateTextGeometry = function() {
    for (var h = 1; h <= Config.HOURS.NUMBER_OF; h++) {
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
    
    var dates = d3.time.months(moment(currentDate).startOf("year").toDate(), moment(currentDate).endOf("year").toDate());
    // console.log(dates);
    for (var m = 0; m < dates.length; m++) {
        var date = moment(dates[m]);
        var monthGeom = new THREE.TextGeometry(date.format("MMM"), {
            font: font,
            size: dateSize,
            dynamic: false
        });
        
        Config.MONTHS.GEOMETRY.push(monthGeom);
    }
}

const hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
const hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);

var days: Day[] = [];

var shiftPressed = false;