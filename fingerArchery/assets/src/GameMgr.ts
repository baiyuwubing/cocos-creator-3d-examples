import { _decorator, Component, Node, systemEvent, SystemEvent, Touch, tweenUtil, ParticleSystemComponent, LabelComponent } from "cc";
import { NodePos } from "./NodePos";
const { ccclass, property } = _decorator;

const CONST_TOUCH_FACTOR = 1e-2; //触摸系数
const CONST_BOW_INIT_X = -1; //弓箭初始位置
const CONST_BOW_INIT_Y = 0; //弓箭初始位置
const CONST_AMI_FACTOR = 12; //瞄准系数
const CONST_TARGET_RADIUS = 3; //目标半径

@ccclass("GameMgr")
export class GameMgr extends Component {
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

    start() {
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
        this.resetBow();
        this.NodePos_target.z = Math.random() * 70 + 30;
        this.lb_distance.string = `距离: ${this.NodePos_target.z.toFixed(1)}m`;
        this._wind = Math.random() - 0.5;
        this.lb_wind.string = `风向：${this._wind < 0 ? '>>> ' : '<<< '}${Math.abs(this._wind).toFixed(2)}`;
    }

    private resetBow() {
        this.NodePos_bows.active = true;
        this.node_ami.active = false;
        this.NodePos_bows.x = CONST_BOW_INIT_X + (Math.random() - 0.5) * 0.1;
        this.NodePos_bows.y = CONST_BOW_INIT_Y + (Math.random() - 0.5) * 0.1;
        this.NodePos_arrow.y = this.NodePos_arrow.x = 0;
        this.NodePos_arrow.z = this.NodePos_bows.z;
    }

    //发射
    private fireArrow() {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node_arrow_camera.active = true;
        this.NodePos_arrow.active = true;

        const targetZ = this.NodePos_target.z;
        const targetX = (this.NodePos_bows.x - CONST_BOW_INIT_X) * CONST_AMI_FACTOR + this._wind * targetZ * 0.1;
        const targetY = (this.NodePos_bows.y - CONST_BOW_INIT_Y) * CONST_AMI_FACTOR - targetZ * 0.01;

        tweenUtil(this.NodePos_arrow)
            .stop()
            .to(5, { z: targetZ, x: targetX, y: targetY })
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
