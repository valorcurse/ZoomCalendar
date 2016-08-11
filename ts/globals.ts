import {Day, Hour} from "./day.ts";

import * as THREE from 'three';

// declare module THREE { 
//     export var FontLoader: any;
//     export class Font {
//         constructor(font: any);
//     }
//     export class TextGeometry extends Geometry {
//         constructor(font: THREE.Font, parameters?: any);
//     }
// }

// export module Config {
    export module HOURS {
        export const NUMBER_OF: number = 24;
        export var  GEOMETRY: THREE.TextGeometry[] = [];
        export var INSTANCES: { [hour: number]: Hour; } = { };
    }
    
    export module DAYS {
        export const NUMBER_OF: number = 31;
        export var GEOMETRY: THREE.TextGeometry[] = [];
    }
    
    export module MONTHS {
        export const NUMBER_OF: number = 12;
        export var GEOMETRY: THREE.TextGeometry[] = [];
    }

// var font: THREE.Font;

export const cellSize = 30;
export const dateSize = cellSize / 16;
export const padding = 0.5;
export const hoursArea = cellSize - padding*2 - dateSize*3;
export const fontSize = hoursArea / 24;

export const rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
export const rectGeom = new THREE.BoxGeometry(cellSize, cellSize, 0);

export const textMaterial = new THREE.MeshBasicMaterial({
    color: 0x00000,
    shading: THREE.FlatShading
});


export const hourMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
export const hourBoxGeom = new THREE.BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);

export var days: Day[] = [];

export var shiftPressed = false;

// }

export interface Point {
    x?: number;
    y?: number;
}