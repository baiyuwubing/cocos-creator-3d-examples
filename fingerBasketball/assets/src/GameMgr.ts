/**
* author: lamyoung
* 公众号: 白玉无冰
*/

const PHY_GROUP = {
    Group0: 1 << 0,
    Group1: 1 << 1
}

const CONST_TOUCH_FACTOR = -1e-2;
const CONST_H = 1.25;
const CONST_S = 2.3;
const CONST_G = -10;
const CONST_T = 0.8;
const CONST_V_Z = CONST_S / CONST_T;
const CONST_V_Y = CONST_H / CONST_T - CONST_G * CONST_T / 2;

const CONST_BALL_INIT_POS = cc.v3();

import { _decorator, Component, Node, RigidBodyComponent, systemEvent, SystemEvent, Touch, ColliderComponent, ICollisionEvent, Vec3, PhysicsSystem, tweenUtil, LabelComponent, AudioSourceComponent, AudioClip, macro } from "cc";
import { NodePos } from "./NodePos";
const { ccclass, property } = _decorator;

@ccclass("GameMgr")
export class GameMgr extends Component {
    @property({ type: RigidBodyComponent, tooltip: '篮球物理组件' })
    rigidBody_basketball: RigidBodyComponent = null;
    @property({ type: ColliderComponent, tooltip: '篮球碰撞组件' })
    colliderComponent_basketball: ColliderComponent = null;

    @property({ type: ColliderComponent, tooltip: '框板碰撞组件' })
    colliderComponent_hoop: ColliderComponent = null;

    @property({ type: NodePos, tooltip: '框板位置' })
    nodePos_hoop: ColliderComponent = null;

    @property({ type: ColliderComponent, tooltip: '地板碰撞组件' })
    colliderComponent_land: ColliderComponent = null;

    @property({ type: ColliderComponent, tooltip: '投中碰撞组件' })
    colliderComponent_goal: ColliderComponent = null;

    @property({ type: LabelComponent, tooltip: '投球得分' })
    lb_count: LabelComponent = null;

    @property({ type: AudioSourceComponent, tooltip: '音效' })
    audio_sound: AudioSourceComponent = null;

    @property({ type: AudioClip, tooltip: '音效' })
    audioClip_in: AudioClip = null;

    @property({ type: AudioClip, tooltip: '音效' })
    audioClip_throw: AudioClip = null;

    @property({ type: AudioClip, tooltip: '音效' })
    audioClip_bounce: AudioClip = null;

    private _throw_count = 0;
    private _hit_count = 0;

    start() {
        PhysicsSystem.instance.gravity = cc.v3(0, CONST_G, 0);
        this.colliderComponent_hoop.on('onCollisionEnter', (event: ICollisionEvent) => {
            this.audio_sound.playOneShot(this.audioClip_bounce);
        }, this);

        this.colliderComponent_land.on('onCollisionEnter', (event: ICollisionEvent) => {
            const otherCollider = event.otherCollider;
            const otherRigidBodyComponent = otherCollider.node.getComponent(RigidBodyComponent);
            if (otherRigidBodyComponent) {
                console.log('地板')
                this.resetBall();
            }
        }, this);

        this.colliderComponent_goal.on('onCollisionEnter', (event: ICollisionEvent) => {
            const otherCollider = event.otherCollider;
            const otherRigidBodyComponent = otherCollider.node.getComponent(RigidBodyComponent);
            if (otherRigidBodyComponent) {
                console.log('进球')
                otherCollider.removeGroup(PHY_GROUP.Group1);
                this._hit_count++;
                this.audio_sound.playOneShot(this.audioClip_in);
            }
        }, this);

        // 设置碰撞mask
        this.colliderComponent_goal.setMask(PHY_GROUP.Group1)

        this.resetBall();
        this.hoopMove();
        this.resetCount();
    }

    private resetCount() {
        this._throw_count = this._hit_count = 0;
        this.updateLabelInfo();
    }

    private updateLabelInfo() {
        this.lb_count.string = `${this._hit_count}/${this._throw_count}`;
    }

    // 篮框移动
    private hoopMove() {
        const time = Math.random() * 3 + 2;
        tweenUtil(this.nodePos_hoop)
            .stop()
            .to(time, { x: -1 })
            .to(time * 2, { x: 1 })
            .to(time, { x: 0 })
            .call(() => {
                this.hoopMove()
            })
            .start()
    }


    // 重置球
    private resetBall() {
        this.rigidBody_basketball.useGravity = false;
        this.rigidBody_basketball.setLinearVelocity(cc.v3())
        this.rigidBody_basketball.setAngularVelocity(cc.v3())
        this.rigidBody_basketball.node.setPosition(CONST_BALL_INIT_POS)
        this.colliderComponent_basketball.addGroup(PHY_GROUP.Group1)

        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.updateLabelInfo();
    }

    // 发射球
    private fireBall(deltaX: number) {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.rigidBody_basketball.setLinearVelocity(cc.v3(deltaX * CONST_TOUCH_FACTOR, CONST_V_Y, CONST_V_Z))
        this.rigidBody_basketball.useGravity = true;

        this._throw_count++;
        this.audio_sound.playOneShot(this.audioClip_throw);
    }

    private _touchStartX = 0;
    private onTouchStart(touch: Touch) {
        this._touchStartX = touch.getLocationX();
    }

    private onTouchEnd(touch: Touch) {
        const deltaX = touch.getLocationX() - this._touchStartX;
        this.fireBall(deltaX);
    }
}
