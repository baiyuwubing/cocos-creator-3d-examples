

// author: http://lamyoung.com/

const CELL_TIME = 0.016;
// 速度
const SPEED = 150;

import { _decorator, Component, Node, Vec3, SkeletalAnimationComponent, macro } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerCtl')
export class PlayerCtl extends Component {

    @property(Node)
    node_role: Node = null;

    @property(Node)
    node_camera: Node = null;

    private _skeletal: SkeletalAnimationComponent;
    // 移动速度
    private _vector: Vec3 = Vec3.ZERO;
    // 旋转速度
    private _vectorAngle: Vec3 = Vec3.ZERO;

    onLoad() {
        this._skeletal = this.node_role.getComponent(SkeletalAnimationComponent);
    }

    /** 移动摇杆触发回调 */
    private joysitckCallback(vector: Vec3, angle: number) {
        // 根据摄像机的角度旋转
        Vec3.rotateZ(vector, vector, Vec3.ZERO, this.node_camera.eulerAngles.y * macro.RAD);
        this._vector = vector.normalize();
        if (angle) {
            // 模型初始朝前，补个90度
            this.node_role.eulerAngles = new Vec3(0, angle + 90 + this.node_camera.eulerAngles.y, 0);
        }
    }

    /** 旋转摇杆触发回调 */
    private joysitckAngleCallback(vector: Vec3, angle: number) {
        this._vectorAngle = vector.normalize();
    }

    private fix_update(dt: number) {
        if (this._vector.lengthSqr() > 0) {
            this.node.setPosition(this.node.position.add3f(this._vector.x * SPEED * dt, 0, -this._vector.y * SPEED * dt));
            this._skeletal.resume();
        } else {
            this._skeletal.pause();
        }

        if (this._vectorAngle.lengthSqr() > 0) {
            this.node_camera.eulerAngles = this.node_camera.eulerAngles.add3f(0, -this._vectorAngle.x, 0);
        }
    }
    
    private _now_time = 0;
    update(dt: number) {
        this._now_time += dt;
        while (this._now_time >= CELL_TIME) {
            this.fix_update(CELL_TIME);
            this._now_time -= CELL_TIME;
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

