import {applyMixins, BasicInterface} from "../globals";
import {Observable, CallbackType} from "../observers";

import {Mesh, Geometry, Material} from "three";

export class View extends Mesh implements Observable, BasicInterface {
    // Mixin declarations for Observable
    observers: Map<string, CallbackType[]>;
    registerObserver: () => void;
    removeObserver: () => void;
    notifyObservers: () => void;
    
    intersectable: boolean = false;
    
    constructor(geometry: Geometry, material: Material) {
        super(geometry, material);
    }
    
}
// Use mixin fuckery because Typescript does not allow
// for multiple inheritance
applyMixins(View, [Observable]);