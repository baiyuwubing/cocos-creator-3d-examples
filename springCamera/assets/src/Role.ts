const CONST_FIX_DT = 1 / 60;

import { _decorator, Component, SkeletalAnimation, Vec3, v3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Role')
export class Role extends Component {
    forward: Vec3 = v3(0, 0, -1);
    up: Vec3 = v3(0, 1, 0);

    moveSpeed: number = 0;
    rotateSpeed: number = 0;

    private _skeletal: SkeletalAnimation = null!;

    private _temp_v3 = v3();
    private _temp_quat: Quat = new Quat();

    onLoad() {
        this._skeletal = this.node.getComponent(SkeletalAnimation)!;
    }


    private moveForward(step: number) {
        Vec3.multiplyScalar(this._temp_v3, this.forward, step);
        this.node.setWorldPosition(this.node.worldPosition.add(this._temp_v3));
    }


    rotateForward(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const z = this.forward.z;
        const x = this.forward.x;
        const rx = z * sin + x * cos;
        const rz = z * cos - x * sin;
        this.forward.set(rx, 0, rz);
        this._temp_quat = Quat.fromViewUp(this._temp_quat, this.forward, this.up);
        this.node.setWorldRotation(this._temp_quat)
    }

    private fixUpdate(dt: number) {
        if (this.moveSpeed > 0) {
            this.moveForward(dt * this.moveSpeed);
            this._skeletal.resume();
        } else {
            this._skeletal.pause();
        }
        if (this.rotateSpeed) {
            this.rotateForward(dt * this.rotateSpeed);
        }
    }

    private _dt = 0;
    update(dt: number) {
        this._dt += dt;
        while (this._dt > CONST_FIX_DT) {
            this.fixUpdate(CONST_FIX_DT);
            this._dt -= CONST_FIX_DT;
        }
    }
}
