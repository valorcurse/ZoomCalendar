import {applyMixins, BasicInterface} from "../globals";
import {Observable, CallbackType} from "../observers";

import {Mesh, Geometry, Material} from "three";

export class View extends Mesh implements Observable, BasicInterface {
    // Mixin declarations for Observable
    observers: Map<string, CallbackType[]>;
    registerObserver: (label: string, callback: CallbackType) => void;
    removeObserver: (label: string) => void;
    notifyObservers: (label: string, arg: any) => void;
    
    intersectable: boolean = false;
    
    constructor(geometry: Geometry, material: Material) {
        super(geometry, material);
        this.observers = new Map<string, CallbackType[]>();
    }
    
}
// Use mixin fuckery because Typescript does not allow
// for multiple inheritance
applyMixins(View, [Observable]);