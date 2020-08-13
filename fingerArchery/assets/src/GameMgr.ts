import { _decorator, Component, Node, systemEvent, SystemEvent, Touch, tween, CameraComponent, LabelComponent, Vec3, log, Tween } from "cc";
import { NodePos } from "./NodePos";
const { ccclass, property } = _decorator;

const CONST_TOUCH_FACTOR = 1e-2; //触摸系数
const CONST_BOW_INIT_X = 0; //弓箭初始位置
const CONST_BOW_INIT_Y = 0; //弓箭初始位置
const CONST_TARGET_RADIUS = 3; //目标半径

@ccclass("GameMgr")
export class GameMgr extends Component {

    @property({ type: CameraComponent, tooltip: '主-摄像机' })
    camera_main: CameraComponent = null;

    @property({ type: Node, tooltip: '瞄准器' })
    node_ami: Node = null;

    @property({ type: NodePos, tooltip: '弓箭' })
    NodePos_bows: NodePos = null;

    @property({ type: NodePos, tooltip: '箭' })
    NodePos_arrow: NodePos = null;

    @property({ type: NodePos, tooltip: '靶子' })
    NodePos_target: NodePos = null;

    @property({ type: Node, tooltip: '箭-摄像机' })
    node_arrow_camera: Node = null;

    @property({ type: Node, tooltip: '结束界面' })
    node_gameOver: Node = null;


    @property({ type: LabelComponent, tooltip: '分数' })
    lb_score: LabelComponent = null;

    @property({ type: LabelComponent, tooltip: '距离' })
    lb_distance: LabelComponent = null;

    @property({ type: LabelComponent, tooltip: '风向' })
    lb_wind: LabelComponent = null;


    private _wind = 0;

    private _tween_target: Tween = null;

    start() {
        this._tween_target = tween(this.NodePos_target);
    }

    //重置游戏
    private resetGame() {
        this.node_gameOver.active = false;
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node_arrow_camera.active = false;
        this.NodePos_arrow.active = false;

        this._wind = Math.round(Math.random() * 100) - 50;
        this.lb_wind.string = `风向：${this._wind < 0 ? '>>> ' : '<<< '}${Math.abs(this._wind)}`;

        this.camera_main.node.setPosition(Math.random(), this.camera_main.node.position.y, this.camera_main.node.position.z)

        this.resetBow();
        this.resetTarget();
    }

    private resetTarget() {
        this.NodePos_target.z = Math.round(Math.random() * 10) / 10 * 70 + 30;
        this.lb_distance.string = `距离: ${this.NodePos_target.z}m`;
        this.NodePos_target.y = 3 * Math.random();
        this.NodePos_target.x = -3;
        this._tween_target
            .stop()
            .to(2, { x: 3 })
            .to(2, { x: -3 })
            .union()
            .repeatForever()
            .start();
    }

    private resetBow() {
        this.NodePos_bows.active = true;
        this.node_ami.active = false;
        this.NodePos_bows.x = CONST_BOW_INIT_X;
        this.NodePos_bows.y = CONST_BOW_INIT_Y;
        this.NodePos_arrow.y = this.NodePos_arrow.x = 0;
        this.NodePos_arrow.z = this.NodePos_bows.z;
    }

    //发射
    private fireArrow() {
        // log('fireArrow')
        this._tween_target
            .stop()

        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node_arrow_camera.active = true;
        this.NodePos_arrow.active = true;

        const screenPoint = this.camera_main.worldToScreen(this.NodePos_bows.node.worldPosition);
        const outRay = this.camera_main.screenPointToRay(screenPoint.x, screenPoint.y);
        const targetZ = this.NodePos_target.z;
        const dir_t = (targetZ - outRay.o.z) / outRay.d.z;
        const targetX = outRay.o.x + outRay.d.x * dir_t + this._wind * targetZ * 0.001;
        const targetY = outRay.o.y + outRay.d.y * dir_t - targetZ * 0.01;

        tween(this.NodePos_arrow)
            .stop()
            .to(0.5, { z: targetZ, x: targetX, y: targetY })
            .to(1, {})
            .call(() => {
                this.gameOver();
            })
            .start()

        this.NodePos_bows.active = false;
    }

    private gameOver() {
        this.node_gameOver.active = true;
        const dis = this.NodePos_arrow.position.clone().subtract(this.NodePos_target.position).length();
        const score = dis < CONST_TARGET_RADIUS ? ((1 - dis / CONST_TARGET_RADIUS) * 10).toFixed(2) : ('0');
        this.lb_score.string = score;
    }

    private onTouchStart(touch: Touch) {
        const delta = touch.getDelta();
        this.node_ami.active = true;
    }

    private onTouchMove(touch: Touch) {
        const delta = touch.getDelta();
        this.NodePos_bows.x -= delta.x * CONST_TOUCH_FACTOR;
        this.NodePos_bows.y += delta.y * CONST_TOUCH_FACTOR;
    }

    private onTouchEnd(touch: Touch) {
        const delta = touch.getDelta();
        this.fireArrow();
    }
}
