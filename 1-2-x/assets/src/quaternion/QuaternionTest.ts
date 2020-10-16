// author: http://lamyoung.com/

import { _decorator, Component, Node, v3, macro, tween, Quat, Vec3, systemEvent, SystemEvent, Touch, v2 } from 'cc';
import { BezierN } from '../common/BezierN';
const { ccclass, property } = _decorator;

@ccclass('QuaternionTest')
export class QuaternionTest extends Component {
    @property(Node)
    node_bezier_role: Node = null;

    @property(Node)
    node_touch_rotation_role: Node = null;


    @property(Node)
    node_touch_axi_role: Node = null;

    @property(Node)
    node_axi: Node = null;

    start() {
        this.initBezierRole();
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    private initBezierRole() {
        const bezier = new BezierN([v3(-1, 0, 0), v3(-5, 2, -5), v3(0, 5, -10)]);
        const bezier2 = new BezierN([v3(0, 5, -10), v3(5, 2, -5), v3(-1, 0, 0)]);
        const list = bezier.getPointList(20).concat(bezier2.getPointList(20));
        this.flyRole(list);
    }

    private flyRole(list: Vec3[]) {
        this.node_bezier_role.position = list[0];
        const tw = tween(this.node_bezier_role);
        const quat_start = new Quat();
        this.node_bezier_role.getRotation(quat_start);
        for (let index = 1; index < list.length; index++) {
            const cur_p = list[index - 1];
            const next_p = list[index];
            const quat_end = new Quat();
            const quat_now = new Quat();
            const dir = next_p.clone().subtract(cur_p);
            const dir_len = dir.length();
            // 模型正好朝z轴方向
            Quat.fromViewUp(quat_end, dir.normalize(), v3(0, 1, 0));
            tw.to(dir_len, { position: next_p }, {
                onUpdate: (target, ratio: number) => {
                    // 这里使用球面插值，旋转时不会出现变形
                    quat_now.set(quat_start).slerp(quat_end, ratio);
                    this.node_bezier_role.setRotation(quat_now);
                },
                onComplete: () => {
                    this.node_bezier_role.getRotation(quat_start);
                },
            })
        }
        tw.call(() => {
            this.flyRole(list);
        })
        tw.start();
    }

    private __temp_quat = new Quat();
    private __temp_v3 = v3();
    private onTouchMove(touch: Touch) {
        const delta = touch.getDelta();

        // 自传
        // 这个物体模型‘锚点’在正中心效果比较好
        // 垂直的轴，右手  
        //  
        //  旋转轴
        //  ⬆️
        //  ---> 触摸方向
        const axis = v3(-delta.y, delta.x, 0); //旋转轴
        const rad = delta.length() * 1e-2; //旋转角度
        const quat_cur = this.node_touch_rotation_role.getRotation();
        Quat.rotateAround(this.__temp_quat, quat_cur, axis.normalize(), rad);
        this.node_touch_rotation_role.setRotation(this.__temp_quat);


        // 绕轴转
        // 这里选取轴朝上
        const axis2 = Vec3.UP;//旋转轴
        const rad2 = 1e-2 * delta.x; //旋转角度
        // 计算坐标
        const point = this.node_axi.worldPosition; //旋转点
        const point_now = this.node_touch_axi_role.worldPosition;
        // 算出坐标点的旋转四元数
        Quat.fromAxisAngle(this.__temp_quat, axis2, rad2);
        // 计算旋转点和现有点的向量
        Vec3.subtract(this.__temp_v3, point_now, point);
        // 计算旋转后的向量
        Vec3.transformQuat(this.__temp_v3, this.__temp_v3, this.__temp_quat)
        // 计算旋转后的点
        Vec3.add(this.__temp_v3, point, this.__temp_v3);
        this.node_touch_axi_role.setWorldPosition(this.__temp_v3);

        // 计算朝向
        // 这么旋转会按原始的朝向一起旋转
        const quat_now = this.node_touch_axi_role.worldRotation;
        Quat.rotateAround(this.__temp_quat, quat_now, axis2, rad2);
        Quat.normalize(this.__temp_quat, this.__temp_quat);
        this.node_touch_axi_role.setWorldRotation(this.__temp_quat);
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

