import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("NodePos")
export class NodePos extends Component {
    private _curPos: Vec3 = cc.v3();

    start() {
        this._curPos = this.node.position;
    }
    
    get x() {
        return this._curPos.x;
    }
    set x(x: number) {
        this._curPos.x = x;
    }

    get y() {
        return this._curPos.y;
    }
    set y(y: number) {
        this._curPos.y = y;
    }

    get z() {
        return this._curPos.z;
    }
    set z(z: number) {
        this._curPos.z = z;
    }

    get active() {
        return this.node.active;
    }
    set active(bool: boolean) {
        this.node.active = bool;
    }

    get position(){
        return this.node.position;
    }

    update(deltaTime: number) {
        this.node.position = this._curPos;
    }
}
