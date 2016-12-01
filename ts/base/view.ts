import {applyMixins, BasicInterface} from "../globals";
import {Observable, CallbackType} from "../observers";

import {Mesh, Geometry, Material, Vector2} from "three";

export abstract class View extends Mesh implements Observable, BasicInterface {
    // Mixin declarations for Observable
    observers: Map<string, CallbackType[]>;
    registerObserver: (label: string, callback: CallbackType) => void;
    removeObserver: (label: string) => void;
    notifyObservers: (label: string, arg: any) => void;
    
    intersectable: boolean = false;
    
    abstract mouseLeave(): void;
    abstract mouseOver(uv: Vector2): void;
    abstract mouseUp(uv: Vector2): void;
    abstract mouseDown(uv: Vector2): void;
    
    constructor(geometry: Geometry, material: Material) {
        super(geometry, material);
        this.observers = new Map<string, CallbackType[]>();
    }
    
}
// Use mixin fuckery because Typescript does not allow
// for multiple inheritance
applyMixins(View, [Observable]);