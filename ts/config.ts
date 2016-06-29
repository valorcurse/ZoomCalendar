///<reference path="../typings/index.d.ts"/>

// declare module THREE { 
//     export var FontLoader: any;
//     export class Font {
//         constructor(font: any);
//     }
//     export class TextGeometry extends Geometry {
//         constructor(font: THREE.Font, parameters?: any);
//     }
// }

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

// var font: THREE.Font;

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


const hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
const hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);

var days: Day[] = [];

var shiftPressed = false;

interface Point {
    x?: number;
    y?: number;
}