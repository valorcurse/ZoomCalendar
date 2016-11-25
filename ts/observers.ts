export interface CallbackType { (arg: any): void }

export class Observable {
    observers: Map<string, CallbackType[]> = new Map<string, CallbackType[]>();

    constructor() {
        // this.observers = new Map<string, CallbackType[]>();
    }

    registerObserver (label: string, callback: CallbackType) : void {
        if (!this.observers.has(label))
            this.observers.set(label, []);
            
        this.observers.get(label).push(callback);
    }

    removeObserver (label: string) : void {
        this.observers.delete(label);
    }

    notifyObservers (label: string, arg: any) : void {
        this.observers.get(label).forEach((callback) => {
            callback(arg);
        });
    }
}