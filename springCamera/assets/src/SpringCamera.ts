// https://mp.weixin.qq.com/s/NCn8Ygk_I_nRnhmbHQeZwQ
const CONST_FIX_DT = 1 / 60;

import { _decorator, Component, Node, Camera, Vec3, v3, Quat } from 'cc';
import { Role } from './Role';
const { ccclass, property } = _decorator;

@ccclass('SpringCamera')
export class SpringCamera extends Component {

    @property(Camera)
    camera: Camera = null!;

    @property(Role)
    followRole: Role = null!;

    @property
    hDist: number = 5;

    @property
    fDist: number = 5;

    private _temp_v3: Vec3 = v3();
    private _temp2_v3: Vec3 = v3();
    private _temp_quat: Quat = new Quat();


    private _speed: Vec3 = v3();
    _springConst = 80;
    _dampConst = 50;


    start() {
        this.initCamera();
    }

    private getIdealPos() {
        Vec3.multiplyScalar(this._temp2_v3, this.followRole.forward, this.hDist)
        Vec3.subtract(this._temp_v3, this.followRole.node.worldPosition, this._temp2_v3);
        Vec3.multiplyScalar(this._temp2_v3, this.followRole.up, this.fDist)
        Vec3.add(this._temp_v3, this._temp_v3, this._temp2_v3);
        return this._temp_v3;
    }

    private updateRotation() {
        Vec3.subtract(this._temp2_v3, this.node.worldPosition, this.followRole.node.worldPosition);//相机的前方向是反的
        Quat.fromViewUp(this._temp_quat, this._temp2_v3.normalize(), this.followRole.up)
        this.node.setWorldRotation(this._temp_quat);
    }

    private initCamera() {
        this.node.setWorldPosition(this.getIdealPos());
        this.updateRotation();
    }

    private fixUpdate(dt: number) {
        const idealPos = this.getIdealPos();
        // now -> ideal
        const now2idealVec = idealPos.subtract(this.node.worldPosition);
        const acceleration = now2idealVec.multiplyScalar(this._springConst).subtract(this._speed.clone().multiplyScalar(this._dampConst));
        this._speed.add(acceleration.multiplyScalar(dt));
        this.node.setWorldPosition(this.node.worldPosition.add(this._speed));
        this.updateRotation();
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
/*

欢迎关注微信公众号 [白玉无冰]

导航：https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ


█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄██▀▄ ▄▄██ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄▀▀▀█▄▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀▀ ▀▄▄ ▄ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄ █ █ ▀ ▀▄█▄▀████
████▀ ▄  █▄█▀█▄█▀█  ▀▄ █ ▀ ▄▄██▀█████
████ ▄▀▄▄▀▄ █▄▄█▄ ▀▄▀ ▀ ▀ ▀▀▀▄ █▀████
████▀ ██ ▀▄ ▄██ ▄█▀▄ ██▀ ▀ █▄█▄▀█████
████   ▄██▄▀ █▀▄▀▄▀▄▄▄▄ ▀█▀ ▀▀ █▀████
████ █▄ █ ▄ █▀ █▀▄█▄▄▄▄▀▄▄█▄▄▄▄▀█████
████▄█▄█▄█▄█▀ ▄█▄   ▀▄██ ▄▄▄ ▀   ████
████ ▄▄▄▄▄ █▄██ ▄█▀  ▄   █▄█  ▄▀█████
████ █   █ █ ▄█▄ ▀  ▀▀██ ▄▄▄▄ ▄▀ ████
████ █▄▄▄█ █ ▄▄▀ ▄█▄█▄█▄ ▀▄   ▄ █████
████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄▄█▄██████
█████████████████████████████████████
█████████████████████████████████████
*/