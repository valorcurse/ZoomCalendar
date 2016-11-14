import {Hour} from "./day/day.view";
// import {Day} from "./day.model";

import {TextGeometry,
        MeshBasicMaterial,
        BoxGeometry,
        FlatShading,
        Texture
} from 'three';

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

export module Sizes {
    export const cellSize = 30;
    export const dateSize = cellSize / 16;
    export const padding = 0.5;
    export const hoursArea = cellSize - padding*2 - dateSize*3;
    export const fontSize = hoursArea / 24;
}

export module RTT {
    export var dayTexture: Texture;
}

export interface BasicInterface {
    intersectable: boolean;
    // selectable: boolean;
}

export module Constants {
    export const minutesInDay: number = 1440; // (24 hours * 60 minutes)
}

export module Materials {
    export const rectMaterial = new MeshBasicMaterial({ color: 0xffffff });
    export const hourMaterial = new MeshBasicMaterial({ color: 0xdddddd });
    export const textMaterial = new MeshBasicMaterial({
        color: 0x00000,
        shading: FlatShading
    });
}

export module Components {
    export const rectGeom = new BoxGeometry(Sizes.cellSize, Sizes.cellSize, 0);
    export const hourBoxGeom = new BoxGeometry(Sizes.cellSize - Sizes.padding * 2 - Sizes.fontSize, Sizes.fontSize, 0);
}


export var shiftPressed = false;

export interface Point {
    x?: number;
    y?: number;
}