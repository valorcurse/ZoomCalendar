import {Day, Hour} from "./day";

import {TextGeometry,
        MeshBasicMaterial,
        BoxGeometry,
        FlatShading
} from 'three';

// declare module THREE { 
//     export var FontLoader: any;
//     export class Font {
//         constructor(font: any);
//     }
//     export class TextGeometry extends Geometry {
//         constructor(font: Font, parameters?: any);
//     }
// }

// export module Config {
    export module HOURS {
        export const NUMBER_OF: number = 24;
        export var  GEOMETRY: TextGeometry[] = [];
        export var INSTANCES: { [hour: number]: Hour; } = { };
    }
    
    export module DAYS {
        export const NUMBER_OF: number = 31;
        export var GEOMETRY: TextGeometry[] = [];
    }
    
    export module MONTHS {
        export const NUMBER_OF: number = 12;
        export var GEOMETRY: TextGeometry[] = [];
    }

// var font: Font;

export const cellSize = 30;
export const dateSize = cellSize / 16;
export const padding = 0.5;
export const hoursArea = cellSize - padding*2 - dateSize*3;
export const fontSize = hoursArea / 24;

export const rectMaterial = new MeshBasicMaterial({ color: 0xffffff });
export const rectGeom = new BoxGeometry(cellSize, cellSize, 0);

export const textMaterial = new MeshBasicMaterial({
    color: 0x00000,
    shading: FlatShading
});


export const hourMaterial = new MeshBasicMaterial({ color: 0xdddddd });
export const hourBoxGeom = new BoxGeometry(cellSize - padding * 2 - fontSize, fontSize, 0);

export var days: Day[] = [];

export var shiftPressed = false;

// }

export interface Point {
    x?: number;
    y?: number;
}