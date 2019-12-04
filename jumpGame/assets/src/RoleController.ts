import { _decorator, Component, Node, SystemEvent, systemEvent, Touch, Vec3, Tween, tweenUtil, log, macro, AnimationComponent } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RoleControll")
export class RoleController extends Component {

    private _curPos: Vec3 = cc.v3();
    private _curIndex = 0;

    update(deltaTime: number) {
        this.node.position = this._curPos;
    }

    setInputActive(active: boolean) {
        if (active) {
            systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouMove, this);
            this.schedule(this.jumpRun, 0.02, macro.REPEAT_FOREVER);
            this.node.getComponent(AnimationComponent).getState("Take 001").speed = 10;
        } else {
            systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouMove, this);
            this.node.getComponent(AnimationComponent).getState("Take 001").speed = 1;
            this.unschedule(this.jumpRun);
        }
    }

    resetPos() {
        this.unschedule(this.jumpRun);
        this._curPos.x = this._curPos.y = this._curPos.z = 0;
        this._curIndex = 0;
    }

    private onTouMove(touch: Touch) {
        const delta = touch.getUIDelta();
        let targetX = this._curPos.x - delta.x * 1e-2;
        if (targetX > 4.5) targetX = 4.5;
        if (targetX < - 4.5) targetX = -4.5;
        this._curPos.x = targetX;
    }

    jumpRun() {
        this._curPos.z += 0.1;
        if (Math.floor(this._curPos.z / 2) > this._curIndex) {
            this._curPos.y = 0;
            this._curIndex++;
            this.node.emit('JumpEnd', this._curIndex);
        }
        if (this._curPos.z % 2 < 1) {
            this._curPos.y += 0.2;
        } else {
            this._curPos.y -= 0.2;
        }
    }
}
